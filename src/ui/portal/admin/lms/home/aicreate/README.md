# AI Space Creator Module

This module provides an AI-powered space creation feature for the LMS system. Users can describe their desired learning structure in natural language, and AI will generate a hierarchical space structure.

## Components

### 1. AiCreateSpaceDialog
The main dialog component that handles the AI space creation workflow.

**Features:**
- Text input for AI prompt
- Generate button to call AI service
- Preview of generated structure
- Create button to implement the structure

### 2. AiCreateSpaceDialogStore
Manages the state and business logic for the AI space creator.

**Key Methods:**
- `generateStructure()`: Calls AI service to generate space hierarchy
- `createStructure()`: Creates actual spaces based on AI generated structure
- `clearGenerated()`: Resets the generated structure

### 3. HierarchyPreview
Displays the AI-generated space structure in a tree-like format.

**Features:**
- Visual representation of folders and courses
- Hierarchical indentation
- Type indicators (folder/course icons)

## Usage

### Integration in AllSpacesStore
```typescript
showAiCreateDialog() {
    this.dialogManager.show({
        id: aiCreateSpaceDialogId,
        component: AiCreateSpaceDialog,
        props: {
            parentId: this.currentFolderId,
            adminSpacesService: this.adminSpacesService,
            layoutStore: this.layoutStore,
            allSpacesStore: this,
        },
    });
}
```

### Integration in AllSpacesPage
```tsx
<Button
    color="secondary"
    variant="outline"
    onClick={() => store.showAiCreateDialog()}
    size="md"
>
    <Sparkle className="w-4 h-4 mr-2 text-purple-600" />
    Create with AI
</Button>
```

## User Flow

1. **Click "Create with AI"** - Opens the AI space creator dialog
2. **Enter Prompt** - User describes their desired learning structure
3. **Generate Structure** - AI processes the prompt and returns a hierarchical structure
4. **Preview Structure** - User can see the generated hierarchy with folders and courses
5. **Create Structure** - User can create the actual spaces or generate a new structure

## AI Prompt Examples

- "Create a Python programming course with modules for basics, functions, and data structures"
- "Set up a mathematics curriculum with algebra, geometry, and calculus folders"
- "Build a business training program with sales, marketing, and management courses"

## API Integration

The module uses the existing `AdminSpacesService.aiGenerateSpaceStructure()` method which calls the `/api/v1/admin/spaces/ai-generate` endpoint.

**Request Format:**
```typescript
{
    userPrompt: string,
    parentId: number
}
```

**Response Format:**
```typescript
{
    message: string,
    items: AiSpaceItem[]
}
```

## Error Handling

- Form validation for empty/too short prompts
- API error handling with user-friendly messages
- Loading states during AI generation and space creation
- Graceful fallback if AI generation fails

## Future Enhancements

1. **Batch Operations**: Allow users to modify the generated structure before creation
2. **Templates**: Save and reuse common structures
3. **Preview Mode**: Show estimated creation time and resource usage
4. **Undo Feature**: Allow rollback of recently created structures