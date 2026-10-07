import { getDb } from "@/lib/store";
import ArticleEditorForm from "@/components/admin/ArticleEditorForm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default function EditArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const db = getDb();
  const article = db.articles.find(
    (a) => a.id === params.id || a.slug === params.id
  );

  if (!article) {
    notFound();
  }

  return (
    <ArticleEditorForm
      isEditing={true}
      initialData={{
        id: article.id,
        title: article.title,
        slug: article.slug,
        summary: article.summary,
        content: article.content,
        coverImage: article.coverImage,
        categoryId: article.categoryId,
        tags: article.tags || [],
        status: article.status,
        featured: article.featured,
        breaking: article.breaking,
      }}
    />
  );
}
