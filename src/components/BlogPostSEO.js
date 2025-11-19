import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

const BlogPostSEO = ({ post, slug }) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            siteUrl
            author
            twitterUsername
          }
        }
      }
    `,
  );

  const { title: siteTitle, siteUrl, author, twitterUsername } = site.siteMetadata;

  const postTitle = post.frontmatter.title;
  const postDescription = post.frontmatter.description || post.excerpt || '';
  const postDate = post.frontmatter.date;
  const postUrl = `${siteUrl}/pensieve/${slug}`;
  const postImage = post.frontmatter.image
    ? `${siteUrl}${post.frontmatter.image}`
    : `${siteUrl}/og.png`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: postTitle,
    description: postDescription,
    image: postImage,
    datePublished: postDate,
    dateModified: post.frontmatter.modified || postDate,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Person',
      name: author,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
  };

  return (
    <Helmet>
      <title>{`${postTitle} | ${siteTitle}`}</title>
      <meta name="description" content={postDescription} />
      <link rel="canonical" href={postUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={postTitle} />
      <meta property="og:description" content={postDescription} />
      <meta property="og:image" content={postImage} />
      <meta property="og:url" content={postUrl} />
      <meta property="og:type" content="article" />
      <meta property="article:published_time" content={postDate} />
      <meta property="article:author" content={author} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={postTitle} />
      <meta name="twitter:description" content={postDescription} />
      <meta name="twitter:image" content={postImage} />
      <meta name="twitter:creator" content={twitterUsername} />

      {/* Structured Data */}
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  );
};

BlogPostSEO.propTypes = {
  post: PropTypes.object.isRequired,
  slug: PropTypes.string.isRequired,
};

export default BlogPostSEO;
