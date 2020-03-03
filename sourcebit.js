const toMarkdown = require("@sanity/block-content-to-markdown");

const serializers = {
  marks: {
    link: ({ children, mark }) => ({
      component: Link,
      childNodes: children,
      props: mark,
    }),
  },
  types: {
    code: props =>
      "```" + props.node.language + "\n" + props.node.code + "\n```"
  }
};

module.exports = {
  plugins: [
    {
      module: require("sourcebit-source-sanity"),
      options: {
        accessToken: process.env["SANITY_ACCESS_TOKEN"],
        dataset: "production",
        projectId: "7wqewcb3",
        useCdn: false
      }
    },
    {
      module: require("sourcebit-transform-assets"),
      options: {
        assetPath: function(entry, asset) {
          return [
            "assets",
            [asset.__metadata.id, asset.fileName].join("-")
          ].join("/");
        },
        publicUrl: function(entry, asset, assetPath) {
          return [
            "/assets/sanity/",
            [asset.__metadata.id, asset.fileName].join("-")
          ].join("/");
        }
      }
    },
    ({ data }) => {
      const posts = data.objects.filter(
        object => object.__metadata.modelName === "post"
      );
      // console.log(posts)
      posts.forEach(post => {
        // console.log("post", post);
        // console.log("body", post.body);
        console.log("markdown", toMarkdown(post.body, { serializers }));
      });
    },
    {
      module: require("sourcebit-target-hugo"),
      options: {
        writeFile: function(entry, utils) {
          // This function is invoked for each entry and its return value determines
          // whether the entry will be written to a file. When an object with `content`,
          // `format` and `path` properties is returned, a file will be written with
          // those parameters. If a falsy value is returned, no file will be created.
          const { __metadata: meta, ...fields } = entry;
          if (!meta) return;
          const { createdAt = "", modelName, projectId, source } = meta;
          if (
            modelName === "post" &&
            projectId === "7wqewcb3" &&
            source === "sourcebit-source-sanity"
          ) {
            const {
              __metadata = {},
              content,
              layout,
              ...frontmatterFields
            } = entry;
            if (typeof entry.__metadata.createdAt === "string") {
              frontmatterFields.date = entry.__metadata.createdAt.split("T")[0];
            }
            return {
              content: {
                body: fields["content"],
                frontmatter: { ...frontmatterFields, layout: fields["title"] }
              },
              format: "frontmatter-md",
              path: "content/posts/" + utils.slugify(fields["title"]) + ".md"
            };
          }
          if (
            modelName === "author" &&
            projectId === "7wqewcb3" &&
            source === "sourcebit-source-sanity"
          ) {
            const { __metadata, ...fields } = entry;
            return {
              append: false,
              content: fields,
              format: "yml",
              path: "data/author.yml"
            };
          }
          if (
            modelName === "__asset" &&
            projectId === "7wqewcb3" &&
            source === "sourcebit-source-sanity"
          ) {
            const { __metadata, ...fields } = entry;
            return {
              append: true,
              content: fields,
              format: "yml",
              path: "data/__asset.yml"
            };
          }
        }
      }
    }
  ]
};
