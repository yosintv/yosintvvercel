"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import GoogleAd from "@/components/google-ad";
import type { Article } from "@/lib/articles";
import { footerGroups, topNavLinks } from "@/lib/site-data";

type EventItem = {
  name: string;
  link: string;
  image: string;
};

const ARTICLES_PER_PAGE = 5;
const DARK_MODE_KEY = "ystDm";

const topNavItems = topNavLinks.filter((item) => !item.external);

function ArticleCard({
  article,
  featured = false,
}: {
  article: Article;
  featured?: boolean;
}) {
  return (
    <article className={`pc ${featured ? "pc-featured" : ""}`}>
      <div className="pb">
        <div className="label-row">
          {article.labels.map((label) => (
            <span className="pl" key={label}>
              {label}
            </span>
          ))}
        </div>
        <Link className="ptitle" href={`/articles/${article.slug}`}>
          {article.title}
        </Link>
        <p className="psnip">{article.snippet}</p>
        <div className="pmeta">
          <span className="pmi">{article.date}</span>
          <span className="pmi">{article.author}</span>
        </div>
        <Link className="rbtn" href={`/articles/${article.slug}`}>
          Read More
        </Link>
      </div>
    </article>
  );
}

function EventList({
  items,
  loading,
  emptyText,
}: {
  items: EventItem[];
  loading: boolean;
  emptyText: string;
}) {
  if (loading) {
    return (
      <>
        {Array.from({ length: 2 }, (_, index) => (
          <div className="ev ev-skeleton" key={index}>
            <div className="ev-skel-img skel" />
            <div className="ev-skel-text">
              <div className="skel ev-skel-line ev-skel-line-main" />
              <div className="skel ev-skel-line ev-skel-line-sub" />
            </div>
          </div>
        ))}
      </>
    );
  }

  if (!items.length) {
    return <p className="ev-loading">{emptyText}</p>;
  }

  return (
    <>
      {items.map((event) => (
        <a
          className="ev"
          href={event.link || "#"}
          key={`${event.name}-${event.link}`}
          rel="noreferrer"
          target="_blank"
        >
          <img alt={event.name} src={event.image || "https://web.cricfoot.net/favico.png"} />
          <span className="ev-t">{event.name}</span>
        </a>
      ))}
    </>
  );
}

export default function YoSinTVHome({
  initialFilter,
  initialSearch,
  initialArticles,
  initialCricketEvents,
  initialFootballEvents,
}: {
  initialFilter?: string;
  initialSearch?: string;
  initialArticles: Article[];
  initialCricketEvents: EventItem[];
  initialFootballEvents: EventItem[];
}) {
  const [darkMode, setDarkMode] = useState(false);
  const [searchInput, setSearchInput] = useState(initialSearch ?? "");
  const [search, setSearch] = useState(initialSearch ?? "");
  const [activeFilter, setActiveFilter] = useState(initialFilter ?? "all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [cricketEvents] = useState<EventItem[]>(initialCricketEvents);
  const [footballEvents] = useState<EventItem[]>(initialFootballEvents);
  const allArticles = initialArticles;

  const categories = useMemo(() => {
    return Array.from(new Set(allArticles.flatMap((article) => article.labels)));
  }, [allArticles]);

  const filteredArticles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return allArticles.filter((article) => {
      const matchesCategory =
        activeFilter === "all" || article.labels.includes(activeFilter);
      const matchesSearch =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.snippet.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeFilter, allArticles, search]);

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE));

  const pagedArticles = useMemo(() => {
    const start = (currentPage - 1) * ARTICLES_PER_PAGE;
    return filteredArticles.slice(start, start + ARTICLES_PER_PAGE);
  }, [currentPage, filteredArticles]);

  useEffect(() => {
    const savedDarkMode = window.localStorage.getItem(DARK_MODE_KEY) === "true";
    setDarkMode(savedDarkMode);

    const onScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dk", darkMode);
    window.localStorage.setItem(DARK_MODE_KEY, String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const querySearch = params.get("q") ?? initialSearch ?? "";
    const queryFilter = params.get("filter") ?? initialFilter ?? "all";

    setSearchInput(querySearch);
    setSearch(querySearch);
    setActiveFilter(queryFilter);
  }, [initialFilter, initialSearch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, search]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const applySearch = () => {
    setSearch(searchInput.trim());
    setCurrentPage(1);
  };

  return (
    <>
      <header id="yst-hdr">
        <div className="hdr-in">
          <a className="logo" href="/">
            <img alt="YoSinTV" src="https://web.cricfoot.net/logo.png" />
            <span className="logo-fallback">YoSinTV</span>
          </a>
          <div className="hdr-r">
            <div className="search-form">
              <div className="sw">
                <span aria-hidden="true" className="sic">
                  &#8981;
                </span>
                <input
                  className="si"
                  id="yst-s"
                  onChange={(event) => setSearchInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      applySearch();
                    }
                  }}
                  placeholder="Search..."
                  type="text"
                  value={searchInput}
                />
              </div>
            </div>
            <label className="tgl" title="Dark Mode">
              <input
                checked={darkMode}
                id="yst-dm"
                onChange={(event) => setDarkMode(event.target.checked)}
                type="checkbox"
              />
              <span className="sldr" />
            </label>
          </div>
        </div>
      </header>

      <nav className="yst-nav">
        <div className="nav-in">
          {topNavItems.map((item) => (
            <button
              className={`nl ${activeFilter === item.filter ? "active" : ""}`}
              key={item.filter}
              onClick={() => setActiveFilter(item.filter)}
              type="button"
            >
              {item.label}
            </button>
          ))}
          <a
            className="nl"
            href="https://www.cricfoot.net/?ads=yosintv.net"
            rel="noreferrer"
            target="_blank"
          >
            Highlights
          </a>
          <a
            className="nl"
            href="https://t.me/yosintvlive"
            rel="noreferrer"
            target="_blank"
          >
            Telegram
          </a>
        </div>
      </nav>

      <div className="adbar">
        <GoogleAd />
      </div>

      <main className="yst-wrap">
        <div className="yst-content">
          <div className="sh">
            <h2 className="sh-t">All Cricket Events</h2>
            <div className="sh-l" />
            <span className="sh-b">Live</span>
          </div>
          <div className="evg">
            <EventList
              emptyText="No cricket events found."
              items={cricketEvents}
              loading={false}
            />
          </div>

          <div className="sh spaced-top">
            <h2 className="sh-t">All Football Events</h2>
            <div className="sh-l" />
            <span className="sh-b">Live</span>
          </div>
          <div className="evg">
            <EventList
              emptyText="No football events found."
              items={footballEvents}
              loading={false}
            />
          </div>

          <div className="sh spaced-top">
            <h2 className="sh-t">Latest Articles</h2>
            <div className="sh-l" />
          </div>

          <div className="filter-row">
            <button
              className={`fpill ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => setActiveFilter("all")}
              type="button"
            >
              All
            </button>
            {categories.map((category) => (
              <button
                className={`fpill ${activeFilter === category ? "active" : ""}`}
                key={category}
                onClick={() => setActiveFilter(category)}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>

          <div className="articles-container">
            {pagedArticles.length ? (
              <>
                <div className="articles-summary">
                  {filteredArticles.length} article{filteredArticles.length === 1 ? "" : "s"} found
                </div>
                <div className="articles-lead">
                  <ArticleCard article={pagedArticles[0]} featured />
                </div>
                <div className="articles-stack">
                  {pagedArticles.slice(1).map((article) => (
                    <ArticleCard article={article} key={article.title} />
                  ))}
                </div>
              </>
            ) : (
              <div className="empty-state">No articles found.</div>
            )}
          </div>

          {filteredArticles.length > ARTICLES_PER_PAGE ? (
            <div className="pg">
              <button
                className="pg-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                type="button"
              >
                Newer
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  className={`pg-btn ${page === currentPage ? "active" : ""}`}
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  type="button"
                >
                  {page}
                </button>
              ))}
              <button
                className="pg-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                type="button"
              >
                Older
              </button>
            </div>
          ) : null}
        </div>

        <aside className="yst-aside">
          <div className="wgt">
            <div className="wgt-h">Recent Posts</div>
            <div className="wgt-b recent-list">
              {allArticles.slice(0, 5).map((article) => (
                <Link className="rp-item" href={`/articles/${article.slug}`} key={article.title}>
                  <span className="rp-t">{article.title}</span>
                  <span className="rp-d">{article.date}</span>
                </Link>
              ))}
            </div>
          </div>

          <GoogleAd className="sidebar-ad" label="Advertisement" />
        </aside>
      </main>

      <div className="page-shell">
        <div className="dmca">
          <div className="dmca-h">YoSinTV - DMCA Notice</div>
          <p>
            YoSinTV does not host any media content on its own servers. Visitors may use
            external or third-party services to view content, and any shared links are
            hosted elsewhere on the web.
          </p>
        </div>
      </div>

      <div className="bottom-ad page-shell">
        <GoogleAd />
      </div>

      <footer className="yst-ft">
        <div className="ft-in">
          <div className="ft-grid">
            <div>
              <img
                alt="YoSinTV"
                className="footer-logo"
                src="https://web.cricfoot.net/logo.png"
              />
              <p className="footer-copy">
                YoSinTV is sports website that covers all the Cricket Matches, World Cup, International/Domestic Matches, Football Matches, etc. 
              </p>
              <div className="socrow">
                <a
                  className="socbtn"
                  href="https://t.me/yosintvlive"
                  rel="noreferrer"
                  target="_blank"
                >
                  Telegram
                </a>
                <a
                  className="socbtn"
                  href="https://www.cricfoot.net/?ads=yosintv.net"
                  rel="noreferrer"
                  target="_blank"
                >
                  Highlights
                </a>
              </div>
            </div>

            {footerGroups.map((group) => (
              <div key={group.title}>
                <div className="ft-ht">{group.title}</div>
                <ul className="ft-ul">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith("http") ? (
                        <a href={link.href} rel="noreferrer" target="_blank">
                          {link.label}
                        </a>
                      ) : (
                        <Link href={link.href}>{link.label}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="ft-bot">
            <p>
              &copy; {new Date().getFullYear()} <Link href="/">YoSinTV</Link>. All rights reserved.{" "}
              <Link href="/privacy-policy">Privacy</Link> · <Link href="/disclaimer">Disclaimer</Link> ·{" "}
              <Link href="/dmca">DMCA</Link>
            </p>
          </div>
        </div>
      </footer>

      <button
        className={`btt ${showBackToTop ? "on" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        title="Back to top"
        type="button"
      >
        ▲
      </button>
    </>
  );
}
