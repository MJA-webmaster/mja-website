import ArticleEditor from '@/components/ArticleEditor'

export default function NewArticlePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-headline text-3xl font-bold text-navy">New Article</h1>
        <p className="text-gray-400 text-sm mt-1">Write and publish a new article</p>
      </div>
      <ArticleEditor />
    </div>
  )
}
