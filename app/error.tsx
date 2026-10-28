"use client";
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="activation"><a href="/">PhotoCraftSquare</a><h1>A stitch came loose.</h1><p>We couldn’t load this page. Please try again in a moment.</p><button className="button" onClick={reset}>Try again</button></main>}
