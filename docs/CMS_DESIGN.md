# Plan: Flexible Content Management System

The core idea is to introduce three new entities to your database schema: `Page`, `ContentBlock`, and a `BlockType` enum. This structure will allow administrators to dynamically add and manage content across different parts of the website.

## 1. New Data Models

The following models will be added to your `prisma/schema.prisma` file:

*   **`Page`**: Represents a unique page on your website (e.g., Homepage, About Us, Dahabiya Details).
    *   `id`: Unique identifier.
    *   `title`: The title of the page.
    *   `slug`: A URL-friendly version of the title (e.g., "about-us").
    *   `contentBlocks`: A one-to-many relation to `ContentBlock`.

*   **`BlockType` (Enum)**: A predefined list of content types that can be used. This ensures consistency and makes it easier to render the content on the frontend.
    *   `RichText`: For formatted text content.
    *   `Image`: For single images.
    *   `Gallery`: For a collection of images.
    *   `Video`: For embedding videos.
    *   `CallToAction`: For buttons or links with a specific action.

*   **`ContentBlock`**: The central model of the CMS. It represents a single piece of content on a page.
    *   `id`: Unique identifier.
    *   `type`: The type of the block, using the `BlockType` enum.
    *   `content`: A flexible `Json` field to store the actual content. For example:
        *   For `RichText`: `{"text": "<p>Hello World</p>"}`
        *   For `Image`: `{"url": "...", "alt": "..."}`
    *   `order`: An integer to define the order of the blocks on a page.
    *   **Relationships**:
        *   A required relationship to a `Page`.
        *   *Optional* relationships to other models like `Dahabiya` or `Itinerary`. This is the key to the flexibility, allowing you to attach content blocks not just to static pages but also to specific items like a particular cruise.

## 2. Diagram of the New Models

Here is a Mermaid diagram to visualize the new models and their relationships:

```mermaid
erDiagram
    Page {
        String id
        String title
        String slug
    }

    ContentBlock {
        String id
        BlockType type
        Json content
        Int order
        String pageId
        String dahabiyaId
        String itineraryId
    }

    Dahabiya {
        String id
        String name
    }

    Itinerary {
        String id
        String name
    }

    Page ||--o{ ContentBlock : "contains"
    ContentBlock }|..|| Dahabiya : "can be associated with"
    ContentBlock }|..|| Itinerary : "can be associated with"

    enum BlockType {
        RichText
        Image
        Gallery
        Video
        CallToAction
    }

    ContentBlock ||--|{ BlockType : "is of type"

```

## 3. Image Handling

The existing `Image` model will be updated to support being linked to a `ContentBlock`. This will allow you to continue using `uploadthing` for image uploads and associate them with the new CMS content.