import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-900 via-slate-900 to-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Documentation
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Learn how to use ArxivDigest
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Getting Started */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Quickly summarize your first paper</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">
                  1. Find a Paper
                </h4>
                <p className="text-slate-600 dark:text-slate-400">
                  Visit <a href="https://arxiv.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">arxiv.org</a> and find a paper you're interested in.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">
                  2. Copy the PDF URL
                </h4>
                <p className="text-slate-600 dark:text-slate-400">
                  Right-click on the PDF link and copy the URL. It should look like: <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm">https://arxiv.org/pdf/2301.00000.pdf</code>
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">
                  3. Paste and Summarize
                </h4>
                <p className="text-slate-600 dark:text-slate-400">
                  Go to the Summarize page, paste the URL, and click "Summarize Paper". The AI will analyze the paper and provide insights.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>What ArxivDigest can do</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="text-2xl flex-shrink-0">⚡</div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-50">Fast Summaries</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Get comprehensive summaries in seconds using advanced AI
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl flex-shrink-0">📚</div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-50">Build Your Library</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Save summaries and organize your research
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl flex-shrink-0">🔍</div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-50">Structured Insights</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Core contribution, methodology, and key results separated
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl flex-shrink-0">🌙</div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-50">Dark Mode</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Comfortable reading in any lighting
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Limitations */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Limitations</CardTitle>
              <CardDescription>Things to know</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-600 dark:text-slate-400">
              <p>• Processing time depends on PDF size (typically 30-60 seconds)</p>
              <p>• Works best with academic papers in English</p>
              <p>• Summaries are AI-generated and should be verified</p>
              <p>• Some PDFs may have text extraction issues</p>
              <p>• History is stored locally in your browser</p>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
              <CardDescription>Common questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">
                  Why is my paper not summarizing?
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Some PDFs have copy protection or scanned-only content. Try another paper or ensure the PDF URL is publicly accessible.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">
                  Will my data be saved?
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Currently, history is stored only in your browser. Clear your browser data and it will be lost.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">
                  Can I download summaries?
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Yes! Go to History and click the download icon for any paper.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
