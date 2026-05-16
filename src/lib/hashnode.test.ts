import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

describe("hashnode data client", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
    vi.stubEnv("HASHNODE_PUBLICATION_ID", "publication-id");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  test("reports non-JSON Hashnode responses without leaking a JSON parse error", async () => {
    vi.stubEnv("HASHNODE_GQL_ENDPOINT", "https://example.com/not-graphql");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response("<!DOCTYPE html><html><body>Not GraphQL</body></html>", {
          headers: { "content-type": "text/html; charset=utf-8" },
        })
      )
    );

    const { getPostBySlug } = await import("./hashnode");

    await expect(getPostBySlug("hello-world")).rejects.toThrow(
      "Hashnode API returned text/html; charset=utf-8 instead of JSON"
    );
  });

  test("uses the default Hashnode GraphQL endpoint when no endpoint env is set", async () => {
    const fetchMock = vi.fn(async () =>
      Response.json({
        data: {
          publication: {
            post: null,
          },
        },
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const { getPostBySlug } = await import("./hashnode");

    await expect(getPostBySlug("missing-post")).resolves.toBeNull();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://gql.hashnode.com",
      expect.objectContaining({ method: "POST", redirect: "manual" })
    );
  });

  test("reports the Hashnode paid API redirect clearly", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response("", {
          status: 301,
          headers: {
            location: "https://hashnode.com/announcements/graphql-api",
          },
        })
      )
    );

    const { getPostBySlug } = await import("./hashnode");

    await expect(getPostBySlug("hello-world")).rejects.toThrow(
      "Hashnode GraphQL API access now requires paid allow-listing"
    );
  });

  test("retries transient Hashnode gateway errors", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json(
          {
            title: "Error 502: Bad gateway",
            status: 502,
          },
          { status: 502 }
        )
      )
      .mockResolvedValueOnce(
        Response.json({
          data: {
            publication: {
              post: null,
            },
          },
        })
      );
    vi.stubGlobal("fetch", fetchMock);

    const { getPostBySlug } = await import("./hashnode");

    await expect(getPostBySlug("missing-post")).resolves.toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
