// ./src/sanity/schemaTypes/service.ts
import { defineField, defineType } from "sanity";

export const serviceType = defineType({
  name: "service",
  type: "document",
  title: "Service",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Service title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      description: "Service description",
    }),
    defineField({
      name: "icon",
      type: "image",
      title: "Icon",
      description: "Service icon or image",
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
      name: "order",
      type: "number",
      title: "Order",
      description: "Display order (lower numbers appear first)",
      validation: (Rule) => Rule.min(0),
    }),
  ],
  orderings: [
    {
      title: "Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      media: "icon",
    },
  },
});

