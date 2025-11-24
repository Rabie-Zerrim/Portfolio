const config = require('./src/config');
require('events').EventEmitter.defaultMaxListeners = 15; // Or any higher number

module.exports = {
  pathPrefix: '/Portfolio',
  siteMetadata: {
    title: 'Rabie Zerrim - Software Engineer & Full-Stack Developer',
    description:
      'Rabie Zerrim is a software engineer who specializes in building exceptional digital experiences. Expert in React, Spring Boot, Django, and modern web technologies. Portfolio showcasing 12+ innovative projects.',
    siteUrl: 'https://rabie-zerrim.github.io', // No trailing slash allowed!
    image: '/og.png', // Path to your image you placed in the 'static' folder
    twitterUsername: '@Bakedhyun',
    author: 'Rabie Zerrim',
    keywords: [
      'Rabie Zerrim',
      'Software Engineer',
      'Full-Stack Developer',
      'React Developer',
      'Spring Boot',
      'Django',
      'Web Development',
      'Portfolio',
      'JavaScript',
      'TypeScript',
      'Node.js',
      'Software Development',
    ],
    siteLanguage: 'en',
    ogLanguage: 'en_US',
    github: 'https://github.com/Rabie-Zerrim',
    linkedin: 'https://linkedin.com/in/rabie-zerrim',
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: '/',
        query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }
            allSitePage {
              nodes {
                path
              }
            }
          }
        `,
        resolveSiteUrl: () => 'https://rabie-zerrim.github.io',
        resolvePages: ({ allSitePage: { nodes: allPages } }) => allPages.map(page => ({ ...page })),
        serialize: ({ path }) => {
          // Determine priority and change frequency
          let priority = 0.5;
          let changefreq = 'monthly';

          if (path === '/') {
            priority = 1.0;
            changefreq = 'weekly';
          } else if (path.includes('/pensieve/')) {
            priority = 0.7;
            changefreq = 'monthly';
          } else if (path === '/archive/') {
            priority = 0.8;
            changefreq = 'weekly';
          }

          return {
            url: path,
            changefreq,
            priority,
            lastmod: new Date().toISOString(),
          };
        },
      },
    },
    {
      resolve: `gatsby-plugin-robots-txt`,
      options: {
        host: 'https://rabie-zerrim.github.io',
        sitemap: 'https://rabie-zerrim.github.io/sitemap-index.xml',
        policy: [
          {
            userAgent: '*',
            allow: '/',
            disallow: ['/404', '/404.html'],
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Rabie Zerrim - Software Engineer Portfolio',
        short_name: 'Rabie Zerrim',
        description:
          'Software Engineer Portfolio showcasing innovative projects and technical expertise',
        start_url: '/',
        background_color: config.colors.darkNavy,
        theme_color: config.colors.navy,
        display: 'standalone',
        icon: 'src/images/logo.png',
        icons: [
          {
            src: 'src/images/logo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: 'src/images/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        categories: ['portfolio', 'development', 'technology'],
        lang: 'en',
        orientation: 'portrait-primary',
        cache_busting_mode: 'none',
        crossOrigin: 'use-credentials',
      },
    },
    `gatsby-plugin-offline`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: `${__dirname}/content/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/content/posts`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `projects`,
        path: `${__dirname}/content/projects`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            // https://www.gatsbyjs.org/packages/gatsby-remark-external-links
            resolve: 'gatsby-remark-external-links',
            options: {
              target: '_blank',
              rel: 'nofollow noopener noreferrer',
            },
          },
          {
            // https://www.gatsbyjs.org/packages/gatsby-remark-images
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 700,
              linkImagesToOriginal: true,
              quality: 90,
              tracedSVG: { color: config.colors.green },
            },
          },
          {
            // https://www.gatsbyjs.org/packages/gatsby-remark-code-titles/
            resolve: 'gatsby-remark-code-titles',
          }, // IMPORTANT: this must be ahead of other plugins that use code blocks
          {
            // https://www.gatsbyjs.org/packages/gatsby-remark-prismjs
            resolve: `gatsby-remark-prismjs`,
            options: {
              // Class prefix for <pre> tags containing syntax highlighting;
              // defaults to 'language-' (e.g. <pre class="language-js">).
              // If your site loads Prism into the browser at runtime,
              // (e.g. for use with libraries like react-live),
              // you may use this to prevent Prism from re-processing syntax.
              // This is an uncommon use-case though;
              // If you're unsure, it's best to use the default value.
              classPrefix: 'language-',
              // This is used to allow setting a language for inline code
              // (i.e. single backticks) by creating a separator.
              // This separator is a string and will do no white-space
              // stripping.
              // A suggested value for English speakers is the non-ascii
              // character '›'.
              inlineCodeMarker: null,
              // This lets you set up language aliases.  For example,
              // setting this to '{ sh: "bash" }' will let you use
              // the language "sh" which will highlight using the
              // bash highlighter.
              aliases: {},
              // This toggles the display of line numbers globally alongside the code.
              // To use it, add the following line in gatsby-browser.js
              // right after importing the prism color scheme:
              //  require("prismjs/plugins/line-numbers/prism-line-numbers.css")
              // Defaults to false.
              // If you wish to only show line numbers on certain code blocks,
              // leave false and use the {numberLines: true} syntax below
              showLineNumbers: false,
              // If setting this to true, the parser won't handle and highlight inline
              // code used in markdown i.e. single backtick code like `this`.
              noInlineHighlight: false,
              // This adds a new language definition to Prism or extend an already
              // existing language definition. More details on this option can be
              // found under the header "Add new language definition or extend an
              // existing language" below.
              languageExtensions: [
                {
                  language: 'superscript',
                  extend: 'javascript',
                  definition: {
                    superscript_types: /(SuperType)/,
                  },
                  insertBefore: {
                    function: {
                      superscript_keywords: /(superif|superelse)/,
                    },
                  },
                },
              ],
              // Customize the prompt used in shell output
              // Values below are default
              prompt: {
                user: 'root',
                host: 'localhost',
                global: false,
              },
            },
          },
        ],
      },
    },
    // Plausible will be injected via gatsby-ssr.js using the site-specific snippet
  ],
};
