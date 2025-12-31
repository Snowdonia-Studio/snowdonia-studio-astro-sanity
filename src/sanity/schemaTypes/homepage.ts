// ./src/sanity/schemaTypes/homepage.ts
import { defineField, defineType } from "sanity";

export const homepageType = defineType({
  name: "homepage",
  type: "document",
  title: "Homepage",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Main heading for the homepage",
    }),
    defineField({
      name: "subtitle",
      type: "string",
      title: "Subtitle",
      description: "Subheading or tagline",
    }),
    defineField({
      name: 'heroVideo',
      title: 'Hero Video',
      type: 'file',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text'
        }
      ]
    }),
    defineField({
      name: "heroImage",
      type: "image",
      title: "Hero Image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      description: "Main description or introduction text",
    }),
    defineField({
      name: "ctaText",
      type: "string",
      title: "Call to Action Text",
      description: "Text for the primary call-to-action button",
    }),
    defineField({
      name: "ctaLink",
      type: "string",
      title: "Call to Action Link",
      description: "URL for the primary call-to-action button",
    }),
    defineField({
      name: "sections",
      type: "array",
      title: "Sections",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              type: "string",
              title: "Section Title",
            },
            {
              name: "content",
              type: "text",
              title: "Section Content",
            },
            {
              name: "image",
              type: "image",
              title: "Section Image",
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: "alt",
                  type: "string",
                  title: "Alternative Text",
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});

