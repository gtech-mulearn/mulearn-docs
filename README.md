# Mulearn Docs

## What's Included

- **Payload CMS Integration**: Full headless CMS backend for documentation
- **Custom Source Adapter**: Transform Payload data into fumadocs format
- **Role-Based Access Control (RBAC)**: Owner, Admin and User roles for RBAC
- **Sidebar Tabs**: Each category becomes an isolated sidebar tab
- **Hierarchical Docs**: Parent/child relationships for nested documentation
- **Lexical Editor**: Rich text editing with HTML serialization
- **Search**: Built-in search via fumadocs
- **OG Images**: Dynamic OpenGraph image generation

## Project Structure

```
payload-cms/
├── app/
│   ├── (fumadocs)/           # Public documentation routes
│   │   ├── (home)/           # Landing page with category cards
│   │   ├── [[...slug]]/      # Documentation pages
│   │   │   └── layout.tsx    # Docs layout with sidebar tabs
│   │   ├── api/search/       # Search API endpoint
│   │   ├── og/               # OpenGraph image generation
│   └── (payload)/            # Payload admin (protected)
├── collections/
│   ├── Categories.ts         # Doc categories
│   ├── Docs.ts              # Documentation pages
├── components/
│   └── ui/                  # UI components
├── lib/
│   ├── source.ts            # 🔑 Fumadocs source adapter
│   ├── lexical-serializer.ts # Lexical to HTML converter
│   └── utils.ts             # Helper functions
└── payload.config.ts        # Payload CMS config
```

## Getting Started

### Installation

1. **Install dependencies**:

   ```bash
   bun install
   ```

2. **Configure environment**:

   ```bash
   cp .env.example .env.local
   ```

3. **Start development**:

   ```bash
   bun run dev
   ```

## Collections

### Categories

Organize documentation into sections:

- `title`: Category name
- `slug`: URL identifier (e.g., "getting-started")
- `description`: Brief description
- `order`: Display order (ascending)

### Docs

Documentation pages:

- `title`: Page title
- `slug`: URL-friendly slug
- `description`: Page excerpt/description
- `content`: Rich content (Lexical editor)
- `category`: Belongs to which category
- `parent`: Optional parent doc (for nesting)
- `order`: Sort order within category (ascending)
- `_status`: Draft or Published

## How It Works

### Source Adapter Pattern

The heart of this example is `lib/source.ts` - the fumadocs source adapter:

```typescript
import { loader } from "fumadocs-core/source";
import { getPayload } from "payload";

// Create cached source
export const getSource = cache(async () => {
  const payloadSource = await createPayloadSource();
  return loader({
    baseUrl: "/",
    source: payloadSource,
  });
});
```

**What it does**:

1. Fetches categories and docs from Payload
2. Transforms Payload data into fumadocs `VirtualFile` format
3. Builds hierarchical paths (e.g., `/category/parent/child`)
4. Creates meta files for sidebar tabs and ordering
5. Provides standard fumadocs APIs

**In your routes**:

```typescript
const source = await getSource();
const page = source.getPage(slugs);
const tree = source.pageTree;
```

### Sidebar Tabs

Each category becomes an isolated sidebar tab:

1. **Meta files** with `root: true` mark categories as root folders
2. **Pages array** defines document order (preserves Payload `order` field)
3. **Auto-detection** by fumadocs creates the tab interface

When viewing a doc, only that category's docs appear in the sidebar.

## Usage Guide

### Creating Content

1. **Add a Category** (Admin → Categories):
   - Set title, slug, and order
   - Upload an icon (optional)

2. **Create Docs** (Admin → Docs):
   - Assign to a category
   - Set order for positioning
   - Use parent field for nesting
   - Write content in Lexical editor

3. **Publish**:
   - Change status to "Published"
   - Content appears immediately (with revalidation)

### Hierarchical Documentation

To create nested docs:

1. Create parent doc (leave `parent` empty)
2. Create child doc, set `parent` to the parent doc
3. Order determines child position under parent

Example:

```
Getting Started (order: 1)
├── Installation (order: 1, parent: Getting Started)
└── Configuration (order: 2, parent: Getting Started)
```

### Custom Ordering

Documents are ordered by the `order` field (ascending) within their level:

- Categories: Sorted by `order` (sidebar tab order)
- Top-level docs: Sorted by `order` within category
- Child docs: Sorted by `order` under their parent

The source adapter preserves this order using `pages` arrays in meta files.

## Important Considerations

### Async Source Access

⚠️ The `source.pageTree` getter requires async access:

```typescript
// ❌ This won't work (synchronous access)
import { source } from '@/lib/source';
const tree = source.pageTree; // Error!

// ✅ Do this instead (async access)
import { getSource } from '@/lib/source';
const source = await getSource();
const tree = source.pageTree; // Works!
```

This is due to React's cache() requiring async initialization.

### Meta File Ordering

The source adapter uses meta files with `pages` arrays to preserve order:

```typescript
// Category meta file
{
  title: "Getting Started",
  root: true,
  pages: ["installation", "configuration"] // Explicit order
}
```

Without this, fumadocs sorts alphabetically. The adapter automatically generates these based on Payload's `order` field.

### Top-Level vs Nested Docs

The `pages` array only includes **top-level docs** (no parent):

- ✅ Docs without a parent
- ❌ Child docs (they appear under their parent automatically)

This prevents duplicates and maintains hierarchy.

### Content Serialization

Lexical content must be serialized to HTML:

```typescript
import { serializeLexical } from '@/lib/lexical-serializer';

const htmlContent = await serializeLexical(doc.content, payload);
```

The serializer handles:

- Headings, paragraphs, lists
- Links, images, code blocks
- Custom Lexical nodes
- Table of contents extraction

### Database KV Adapter

The template includes support for Payload's database KV adapter, which provides:

- **Key-Value Storage**: Efficient storage for cache, sessions, and temporary data
- **Performance**: Faster access to frequently used data
- **Scalability**: Better handling of high-traffic scenarios
- **Integration**: Seamless integration with DB for persistent storage

The KV adapter is automatically configured and works alongside your main database for optimal performance.

### Database Depth

When querying Payload, use `depth: 2` for collections:

```typescript
const { docs } = await payload.find({
  collection: 'docs',
  depth: 2, // Resolves category and parent relationships
});
```

This ensures relationships are populated, not just IDs.

## Customization

### Adding Fields to Docs

1. **Update Collection** (`collections/Docs.ts`):

   ```typescript
   fields: [
     // ... existing fields
     {
       name: 'author',
       type: 'text',
     }
   ]
   ```

2. **Update Source Adapter** (`lib/source.ts`):

   ```typescript
   data: {
     ...doc,
     author: doc.author, // Include new field
   }
   ```

3. **Use in Pages**:

   ```typescript
   const page = source.getPage(slugs);
   console.log(page.data.author);
   ```

## Troubleshooting

### "pageTree must be accessed via getSource()"

You're trying to access `source.pageTree` directly. Use:

```typescript
const src = await getSource();
const tree = src.pageTree;
```

### Docs not appearing in sidebar

Check:

1. Doc is Published (not Draft)
2. Doc is assigned to a category
3. Category exists and has an `order` value
4. Clear cache and restart dev server

### Sidebar order is wrong

The source adapter preserves Payload's `order` field. Verify:

1. Docs have `order` values set
2. Order is ascending (1, 2, 3...)
3. No duplicate orders at the same level
