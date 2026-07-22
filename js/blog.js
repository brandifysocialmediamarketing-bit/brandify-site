// ============================================
//  BRANDIFY - Blog Page JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. STICKY NAVBAR ---
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // --- 2. HAMBURGER MENU ---
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // --- 3. SCROLL REVEAL ---
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.scroll-reveal').forEach(el => el.classList.add('visible'));
  }

  // --- 4. BLOG POSTS DATA ---
  const posts = [
    {
      tag: 'Meta Ads',
      icon: 'fa fa-rectangle-ad',
      banner: 'banner-teal',
      readTime: '5 min read',
      title: 'Why Are Meta Ads Important for Business Growth in 2026?',
      excerpt: "In today's competitive digital world, Meta Ads have become one of the most powerful online advertising solutions for businesses of every size — helping you reach the right audience and boost sales faster.",
      body: `
        <p>In today's competitive digital world, <strong>Meta Ads</strong> have become one of the most powerful online advertising solutions for businesses of every size. Whether you own a local business, an eCommerce store, or a growing brand, Meta Ads help you reach the right audience, increase brand awareness, generate high-quality leads, and boost sales faster than traditional marketing methods.</p>
        <h3>Reach Your Ideal Target Audience</h3>
        <p>One of the biggest advantages of <strong>Meta Ads</strong> is advanced audience targeting. Businesses can target users based on their location, age, gender, interests, online behavior, and purchasing habits. This ensures that your advertisements are shown to people who are most likely to become customers.</p>
        <h3>Increase Brand Awareness</h3>
        <p>Consistent advertising on <strong>Facebook</strong> and <strong>Instagram</strong> helps businesses build a strong brand presence. Even if users don't purchase immediately, repeated exposure increases trust and keeps your brand at the top of their minds when they are ready to buy.</p>
        <h3>Generate High-Quality Leads</h3>
        <p>Meta Ads make it easy to collect customer inquiries through Lead Forms, WhatsApp Ads, Messenger Ads, and website conversion campaigns. This helps businesses generate qualified leads without requiring customers to fill out lengthy forms.</p>
        <h3>Drive More Website Traffic</h3>
        <p>Businesses looking to grow their online presence can use Meta Ads to send targeted visitors directly to their website. More relevant traffic increases opportunities for conversions, sales, bookings, and customer engagement.</p>
        <h3>Cost-Effective Digital Advertising</h3>
        <p>Compared to many traditional advertising methods, Meta Ads offer excellent value for money. Businesses can start with a small budget, monitor campaign performance, and scale successful campaigns based on measurable results.</p>
        <h3>Advanced Performance Tracking</h3>
        <p>Meta Ads provide detailed analytics, including impressions, reach, clicks, conversions, cost per result, and return on ad spend (ROAS). These insights help businesses optimize campaigns for better performance and higher profitability.</p>
        <h3>Suitable for Every Business</h3>
        <p>Whether you're promoting products, services, events, educational courses, restaurants, real estate, healthcare, fashion, or local businesses, Meta Ads can be customized to achieve your specific marketing goals.</p>
        <h3>Why Businesses Should Invest in Meta Ads</h3>
        <p>As consumer attention continues shifting toward social media platforms, businesses that invest in <strong>Meta Advertising</strong> gain a competitive advantage. With precise targeting, flexible budgets, and measurable results, Meta Ads have become an essential part of every successful digital marketing strategy.</p>
        <h3>Conclusion</h3>
        <p>If your goal is to increase brand visibility, generate quality leads, grow website traffic, or improve sales, <strong>Meta Ads</strong> are one of the most effective digital marketing solutions available today. A well-planned Meta Ads strategy can help businesses reach the right customers, maximize advertising ROI, and achieve long-term business growth.</p>
      `
    },
    {
      tag: 'Reels',
      icon: 'fab fa-instagram',
      banner: 'banner-pink',
      readTime: '6 min read',
      title: 'What Are the Business Benefits of Creating Reels in 2026?',
      excerpt: 'Instagram Reels have become one of the most effective ways for businesses to reach new audiences, increase engagement, and grow their brand online through short-form video content.',
      body: `
        <p>In today's fast-paced digital landscape, <strong>Instagram Reels</strong> have become one of the most effective ways for businesses to reach new audiences, increase engagement, and grow their brand online. Short-form video content is now a key part of every successful <strong>social media marketing strategy</strong>, helping businesses connect with potential customers through creative and engaging content.</p>
        <h3>Increase Brand Visibility</h3>
        <p>One of the biggest advantages of creating <strong>Instagram Reels</strong> is increased brand visibility. Unlike regular posts, Reels have the potential to reach people who do not already follow your business. This allows brands to expand their audience organically and attract new customers.</p>
        <h3>Reach a Larger Audience</h3>
        <p>Instagram's algorithm actively promotes high-quality Reels on the Explore page and Reels feed. Businesses that consistently publish engaging Reels can significantly increase their reach without relying entirely on paid advertising.</p>
        <h3>Boost Customer Engagement</h3>
        <p>Reels encourage users to like, comment, share, and save content more often than traditional posts. Higher engagement signals help improve your content's visibility, allowing your business to connect with more potential customers.</p>
        <h3>Showcase Products and Services</h3>
        <p>Businesses can use Reels to demonstrate products, explain services, share customer testimonials, display behind-the-scenes content, and highlight special offers. Video content helps customers understand your brand more effectively than static images.</p>
        <h3>Increase Website Traffic</h3>
        <p>Well-crafted Instagram Reels encourage viewers to visit your website, explore your services, or contact your business. Combined with strong calls to action, Reels can generate valuable traffic that leads to more inquiries and sales.</p>
        <h3>Build Brand Trust</h3>
        <p>Posting consistent, informative, and authentic Reels helps businesses establish credibility. Educational content, client success stories, and industry tips position your brand as a trusted expert in your niche.</p>
        <h3>Improve Lead Generation</h3>
        <p>Creative Reels can attract potential customers who are genuinely interested in your products or services. Businesses often use Reels to promote offers, encourage direct messages, generate inquiries, and increase conversions.</p>
        <h3>Cost-Effective Marketing Strategy</h3>
        <p>Creating Instagram Reels is one of the most affordable digital marketing methods available today. With creativity and consistency, businesses can achieve significant organic reach without spending large advertising budgets.</p>
        <h3>Stay Competitive in Digital Marketing</h3>
        <p>As short-form video continues to dominate social media platforms, businesses that regularly create Instagram Reels stay ahead of competitors. Brands that embrace video marketing are more likely to attract attention, increase engagement, and drive long-term growth.</p>
        <h3>Conclusion</h3>
        <p>Instagram Reels are no longer just entertainment—they are a powerful business marketing tool. Whether your goal is to increase brand awareness, generate leads, improve customer engagement, or grow website traffic, creating high-quality Instagram Reels can deliver measurable business results. Consistent video content is an essential part of any successful digital marketing strategy in 2026.</p>
      `
    },
    {
      tag: 'Digital Marketing',
      icon: 'fa fa-chart-line',
      banner: 'banner-cyan',
      readTime: '6 min read',
      title: 'The Importance of Digital Marketing for Business Growth in 2026',
      excerpt: "Digital Marketing has become an essential strategy for businesses of all sizes — helping you reach the right audience, build brand awareness, generate quality leads, and increase sales.",
      body: `
        <p>In today's digital-first world, <strong>Digital Marketing</strong> has become an essential strategy for businesses of all sizes. Whether you run a startup, a local business, or a global brand, digital marketing helps you reach the right audience, build brand awareness, generate quality leads, and increase sales. As more customers search for products and services online, having a strong digital presence is no longer optional—it's a necessity.</p>
        <h3>Reach Your Target Audience</h3>
        <p>One of the biggest advantages of digital marketing is the ability to reach the right audience at the right time. Through <strong>Search Engine Optimization (SEO)</strong>, <strong>Google Ads</strong>, <strong>Meta Ads</strong>, email marketing, and social media marketing, businesses can connect with potential customers based on their interests, location, behavior, and online activity.</p>
        <h3>Increase Brand Awareness</h3>
        <p>Digital marketing helps businesses establish a strong online presence across search engines, social media platforms, and websites. Consistent online visibility improves brand recognition and builds trust with potential customers.</p>
        <h3>Generate High-Quality Leads</h3>
        <p>Unlike traditional marketing, digital marketing allows businesses to attract customers who are actively searching for their products or services. This results in higher-quality leads and better conversion rates.</p>
        <h3>Improve Website Traffic</h3>
        <p>Using SEO, content marketing, paid advertising, and social media campaigns, businesses can drive targeted traffic to their websites. More relevant visitors create more opportunities for inquiries, bookings, and sales.</p>
        <h3>Cost-Effective Marketing</h3>
        <p>Digital marketing offers flexible budgets and measurable results. Businesses can start with a small investment, monitor campaign performance, and optimize strategies to maximize their return on investment (ROI).</p>
        <h3>Build Customer Relationships</h3>
        <p>Regular communication through social media, blogs, email newsletters, and valuable content helps businesses build long-term relationships with customers. Strong engagement increases customer loyalty and encourages repeat business.</p>
        <h3>Measure Performance in Real Time</h3>
        <p>Digital marketing provides detailed analytics, allowing businesses to track website traffic, clicks, conversions, customer behavior, and campaign performance. These insights help improve future marketing strategies and business decisions.</p>
        <h3>Stay Ahead of the Competition</h3>
        <p>Businesses that invest in digital marketing gain a competitive advantage by reaching customers faster, adapting to market trends, and creating personalized marketing campaigns that deliver better results.</p>
        <h3>Support Long-Term Business Growth</h3>
        <p>A well-planned digital marketing strategy combines SEO, content marketing, social media marketing, Google Ads, Meta Ads, video marketing, and email marketing to create sustainable business growth. These channels work together to increase visibility, generate leads, and improve customer acquisition over time.</p>
        <h3>Conclusion</h3>
        <p>Digital marketing is one of the most powerful tools for modern businesses. It helps increase brand awareness, attract targeted customers, generate quality leads, improve website traffic, and boost sales. Businesses that embrace digital marketing today are better positioned for long-term success, stronger customer relationships, and continuous growth in an increasingly competitive online marketplace.</p>
      `
    },
    {
      tag: 'Agency',
      icon: 'fa fa-handshake',
      banner: 'banner-purple',
      readTime: '5 min read',
      title: 'Why Brandify Socialmedia Is the Best Choice for Digital Marketing',
      excerpt: "Choosing the right Digital Marketing Agency can make a significant difference in your business growth — see how we build strategies that increase visibility and generate quality leads.",
      body: `
        <p>Choosing the right <strong>Digital Marketing Agency</strong> can make a significant difference in your business growth. At <strong>Brandify Socialmedia</strong>, we don't just create marketing campaigns—we build strategies that help businesses increase their online visibility, generate quality leads, and achieve long-term success.</p>
        <h3>Trusted by Happy Clients</h3>
        <p>One of the biggest reasons businesses choose Brandify Socialmedia is the trust we've built with our clients. We are proud to have helped many happy customers grow their brands through effective <strong>Digital Marketing Services</strong>, creative campaigns, and result-driven strategies. Our client satisfaction and long-term relationships reflect our commitment to delivering real business value.</p>
        <h3>Complete Digital Marketing Solutions</h3>
        <p>We offer a full range of <strong>Digital Marketing Services</strong>, including <strong>Search Engine Optimization (SEO)</strong>, <strong>Meta Ads</strong>, <strong>Google Ads</strong>, <strong>Social Media Marketing</strong>, <strong>Content Creation</strong>, <strong>Reels Marketing</strong>, <strong>Website Development</strong>, and <strong>Branding</strong>. Every strategy is customized to match your business goals and target audience.</p>
        <h3>Results-Driven Marketing Strategy</h3>
        <p>Our focus is on delivering measurable results. Whether your goal is increasing website traffic, generating qualified leads, improving brand awareness, or boosting sales, our marketing experts use data-driven strategies that maximize your return on investment (ROI).</p>
        <h3>Creative Content That Engages</h3>
        <p>High-quality content is the foundation of successful digital marketing. Our team creates eye-catching graphics, engaging Instagram Reels, professional videos, and compelling social media campaigns that capture attention and encourage customer engagement.</p>
        <h3>Transparent and Professional Service</h3>
        <p>At Brandify Socialmedia, we believe in clear communication, honest reporting, and continuous optimization. We keep our clients informed with campaign insights, performance reports, and ongoing improvements to ensure the best possible results.</p>
        <h3>Helping Businesses Grow Every Day</h3>
        <p>Businesses from different industries trust Brandify Socialmedia because we understand modern digital marketing trends and deliver strategies that work. Our mission is to help brands increase visibility, attract more customers, and achieve sustainable business growth in today's competitive online marketplace.</p>
        <h3>Why Choose Brandify Socialmedia?</h3>
        <p>If you're looking for a reliable <strong>Digital Marketing Agency</strong> that combines creativity, strategy, and performance, Brandify Socialmedia is the right partner. With proven digital marketing solutions, dedicated support, and a passion for helping businesses succeed, we are committed to turning your marketing goals into measurable results.</p>
        <h3>Conclusion</h3>
        <p>Brandify Socialmedia is more than a digital marketing agency—we are your business growth partner. From SEO and Meta Ads to Google Ads, social media marketing, and creative branding, we provide complete digital marketing solutions designed to help your business grow faster, reach more customers, and achieve lasting success.</p>
      `
    },
    {
      tag: 'Website Development',
      icon: 'fa fa-globe',
      banner: 'banner-orange',
      readTime: '4 min read',
      title: 'Why Every Business Needs a Professional Website in 2026',
      excerpt: 'In today’s digital world, having a professional website is no longer optional — it is a necessity. Your website is the foundation of your online presence, working as your digital salesperson 24/7.',
      body: `
        <p>In today's digital world, having a professional website is no longer optional—it is a necessity. Whether you own a local shop, a startup, or an established company, your website is the foundation of your online presence.</p>
        <p>A professionally designed website builds trust, increases brand awareness, and helps customers find your business 24/7. Unlike social media platforms, your website gives you complete control over your brand, content, and customer experience.</p>
        <p>A fast, mobile-friendly, and SEO-optimized website improves your visibility on Google. This means more potential customers can discover your business through organic search results without relying solely on paid advertising.</p>
        <p>Modern websites also help businesses generate leads, showcase products and services, collect customer inquiries, and improve conversion rates. Features such as contact forms, live chat, online booking, and e-commerce make it easier for visitors to become paying customers.</p>
        <p>At Brandify Socialmedia, we create professional websites that are responsive, secure, and optimized for performance. Every website is designed with user experience and search engine optimization in mind, ensuring your business stands out in a competitive market.</p>
        <p>If you want to grow your business online, investing in a professional website is one of the smartest decisions you can make. A well-designed website not only represents your brand but also works as your digital salesperson every day of the year.</p>
        <p>Ready to build a website that drives results? <a href="index.html#contact" style="color:var(--cyan); text-decoration:underline;">Contact Brandify Socialmedia</a> today and let us help you create a strong online presence.</p>
      `
    }
  ];

  // --- 5. FEATURED POST (hero right) ---
  const featuredEl = document.getElementById('featuredPost');
  const FEATURED_INDEX = 0;
  if (featuredEl) {
    const f = posts[FEATURED_INDEX];
    featuredEl.innerHTML = `
      <article class="featured-card">
        <div class="featured-card-banner ${f.banner}"><i class="${f.icon}"></i></div>
        <div class="featured-card-body">
          <span class="featured-flag"><i class="fa fa-star"></i> Featured Story</span>
          <div class="blog-card-meta">
            <span class="blog-tag">${f.tag}</span>
            <span class="blog-read-time"><i class="fa fa-clock"></i> ${f.readTime}</span>
          </div>
          <h3>${f.title}</h3>
          <p>${f.excerpt}</p>
          <span class="blog-read-more">Read Story <i class="fa fa-arrow-right"></i></span>
        </div>
      </article>
    `;
    featuredEl.querySelector('.featured-card').addEventListener('click', () => openBlogModal(FEATURED_INDEX));
  }

  // --- 6. RENDER BLOG CARDS (with filtering) ---
  const grid = document.getElementById('blogGrid');
  const emptyEl = document.getElementById('blogEmpty');
  let activeCat = 'all';
  let searchTerm = '';

  function renderGrid() {
    if (!grid) return;
    grid.innerHTML = '';
    const filtered = posts
      .map((post, i) => ({ post, i }))
      .filter(({ post }) => {
        const matchesCat = activeCat === 'all' || post.tag === activeCat;
        const q = searchTerm.trim().toLowerCase();
        const matchesSearch = !q ||
          post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.tag.toLowerCase().includes(q);
        return matchesCat && matchesSearch;
      });

    if (!filtered.length) {
      grid.style.display = 'none';
      if (emptyEl) emptyEl.style.display = 'block';
      return;
    }
    grid.style.display = 'grid';
    if (emptyEl) emptyEl.style.display = 'none';

    filtered.forEach(({ post, i }) => {
      const card = document.createElement('article');
      card.className = 'blog-card';
      card.innerHTML = `
        <div class="blog-card-banner ${post.banner}"><i class="${post.icon}"></i></div>
        <div class="blog-card-body">
          <div class="blog-card-meta">
            <span class="blog-tag">${post.tag}</span>
            <span class="blog-read-time"><i class="fa fa-clock"></i> ${post.readTime}</span>
          </div>
          <h3>${post.title}</h3>
          <p>${post.excerpt}</p>
          <span class="blog-read-more">Read Story <i class="fa fa-arrow-right"></i></span>
        </div>
      `;
      card.addEventListener('click', () => openBlogModal(i));
      grid.appendChild(card);
    });
  }
  renderGrid();

  // --- 7. CATEGORY PILLS ---
  const pills = document.querySelectorAll('.blog-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCat = pill.getAttribute('data-cat');
      renderGrid();
    });
  });

  // --- 8. SEARCH ---
  const searchInput = document.getElementById('blogSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value;
      renderGrid();
    });
  }

  // --- 9. NEWSLETTER FORM ---
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterNote = document.getElementById('newsletterNote');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletterEmail');
      if (email && email.value.trim()) {
        newsletterNote.textContent = "You're on the list! We'll be in touch soon. ✦";
        newsletterNote.classList.add('success');
        email.value = '';
      }
    });
  }

  // --- 10. CUSTOM MAGNETIC CURSOR ---
  const cursorDot  = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (cursorDot && cursorRing && !isTouchDevice) {
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let ringX = mouseX, ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    function animateRing() {
      const ease = 0.10;
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateRing);
    }
    requestAnimationFrame(animateRing);

    // Hover-grow on interactive elements (delegated so dynamically-rendered cards work too)
    const hoverSelector = 'a, button, .blog-card, .featured-card, .blog-pill';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverSelector)) {
        cursorDot.classList.add('cursor-hover');
        cursorRing.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverSelector)) {
        cursorDot.classList.remove('cursor-hover');
        cursorRing.classList.remove('cursor-hover');
      }
    });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    });
  } else if (cursorDot && cursorRing) {
    cursorDot.style.display = 'none';
    cursorRing.style.display = 'none';
  }

  // --- 11. BLOG MODAL ---
  const blogModal = document.getElementById('blogModal');
  const blogModalBanner = document.getElementById('blogModalBanner');
  const blogModalIcon = document.getElementById('blogModalIcon');
  const blogModalTag = document.getElementById('blogModalTag');
  const blogModalRead = document.getElementById('blogModalRead');
  const blogModalTitle = document.getElementById('blogModalTitle');
  const blogModalBody = document.getElementById('blogModalBody');
  const closeBlogModal = document.getElementById('closeBlogModal');

  function openBlogModal(i) {
    const post = posts[i];
    blogModalBanner.className = `blog-modal-banner ${post.banner}`;
    blogModalIcon.className = post.icon;
    blogModalTag.textContent = post.tag;
    blogModalRead.innerHTML = `<i class="fa fa-clock"></i> ${post.readTime}`;
    blogModalTitle.textContent = post.title;
    blogModalBody.innerHTML = post.body;
    blogModal.classList.add('open');
    blogModal.querySelector('.modal-box').scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    blogModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBlogModal) closeBlogModal.addEventListener('click', closeModal);
  if (blogModal) {
    blogModal.addEventListener('click', (e) => {
      if (e.target === blogModal) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && blogModal.classList.contains('open')) closeModal();
  });

});
