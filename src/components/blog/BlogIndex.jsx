'use client';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import BlogCard from '@/components/blog/BlogCard';
import animationCharCome from '@/lib/utils/animationCharCome';

export default function BlogIndex({ initialPosts, initialCategories, pagination }) {
  const charAnim = useRef();
  const searchParams = useSearchParams();
  const lang = searchParams?.get('lang') || 'fr';
  const [posts, setPosts] = useState(initialPosts || []);
  const [categories, setCategories] = useState(initialCategories || []);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => { animationCharCome(charAnim.current); }, []);
  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchPosts(1, selectedCategory); }, [selectedCategory]);

  const fetchPosts = async (p = 1, cat = '') => {
    let url = `/api/blog/posts?page=${p}`;
    if (cat) url += `&category=${cat}`;
    const res = await fetch(url);
    const data = await res.json();
    setPosts(data.posts || []);
  };

  const fetchCategories = async () => {
    const res = await fetch('/api/blog/categories');
    const data = await res.json();
    setCategories(data.categories || []);
  };

  return (
    <section className="blog__area pt-130 pb-130">
      <div className="container">
        <div className="row pb-80">
          <div className="col-xxl-8 col-xl-7 col-lg-6 col-md-6">
            <div className="sec-title-wrapper">
              <h2 className="sec-title-2 animation__char_come" ref={charAnim}>
                Our <br /> Blog
              </h2>
            </div>
          </div>
          <div className="col-xxl-4 col-xl-5 col-lg-6 col-md-6">
            <div className="blog__text">
              <p>Crafting new bright brands, unique visual systems and digital experience focused on a wide range of original collabs.</p>
            </div>
          </div>
        </div>
        {categories.length > 0 && (
          <div className="mb-4">
            <button className={`btn btn-sm ${!selectedCategory ? 'btn-primary' : 'btn-outline-secondary'} me-2`} onClick={() => setSelectedCategory('')}>All</button>
            {categories.map(c => (
              <button key={c} className={`btn btn-sm ${selectedCategory === c ? 'btn-primary' : 'btn-outline-secondary'} me-2`} onClick={() => setSelectedCategory(c)}>{c}</button>
            ))}
          </div>
        )}
        <div className="row g-4">
          {posts.map(p => (
            <div className="col-lg-4 col-md-6" key={p.id}>
              <BlogCard post={p} />
            </div>
          ))}
        </div>
        {pagination?.pages > 1 && (
          <div className="d-flex justify-content-center mt-5">
            {Array.from({ length: pagination.pages }, (_, i) => (
              <button key={i} className={`btn ${page === i + 1 ? 'btn-primary' : 'btn-outline-secondary'} me-1`} onClick={() => { setPage(i + 1); fetchPosts(i + 1, selectedCategory); }}>{i + 1}</button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
