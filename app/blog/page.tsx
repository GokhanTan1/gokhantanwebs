import Link from "next/link"

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "Getting Started with Next.js",
      excerpt: "Learn how to build modern web applications with Next.js",
      date: "March 15, 2023",
    },
    {
      id: 2,
      title: "Mastering Tailwind CSS",
      excerpt: "Tips and tricks for using Tailwind CSS effectively in your projects",
      date: "February 22, 2023",
    },
    {
      id: 3,
      title: "The Power of TypeScript",
      excerpt: "Why TypeScript is becoming the standard for modern web development",
      date: "January 10, 2023",
    },
  ]

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-12 text-center">Blog</h1>
        <div className="max-w-3xl mx-auto space-y-8">
          {posts.map((post) => (
            <Link href={`/blog/${post.id}`} key={post.id}>
              <article className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-gray-600 transition-all duration-300">
                <h2 className="text-2xl font-semibold text-white mb-2">{post.title}</h2>
                <p className="text-gray-400 text-sm mb-4">{post.date}</p>
                <p className="text-gray-300">{post.excerpt}</p>
                <div className="mt-4 text-primary font-medium">Read more →</div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

