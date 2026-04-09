import Link from 'next/link';
import Image from 'next/image';

export default function BlogCard({ post, lang = 'fr' }) {
  const isFr = lang === 'fr';
  return (
    <div className="blog__card">
      <div className="blog__thumb">
        {post.coverImage ? (
          <Link href={`/blog/${post.slug}?lang=${lang}`}>
            <Image priority width={400} height={250} style={{ width: '100%', height: 'auto' }} src={post.coverImage} alt={isFr ? post.titleFr : post.titleEn} />
          </Link>
        ) : (
          <div className="blog__thumb bg-secondary" style={{ height: 200 }} />
        )}
      </div>
      <div className="blog__content">
        <span className="blog__cat">{post.category}</span>
        <h4 className="blog__title">
          <Link href={`/blog/${post.slug}?lang=${lang}`}>{isFr ? post.titleFr : post.titleEn}</Link>
        </h4>
        <p>{isFr ? post.excerptFr : post.excerptEn}</p>
        <div className="blog__meta">
          <span>{new Date(post.publishedAt).toLocaleDateString(isFr ? 'fr-FR' : 'en-US')}</span>
          {post.tags?.slice(0, 2).map(t => <span key={t} className="badge bg-light text-dark ms-1">{t}</span>)}
        </div>
      </div>
    </div>
  );
}
