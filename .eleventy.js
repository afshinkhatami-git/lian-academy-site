const markdownIt = require("markdown-it")({ html: false });

module.exports = function (eleventyConfig) {
  // فیلتر تبدیل رشته‌ی Markdown خام (مثل فیلدهای full_description و
  // description که در config.yml به‌جای "body" اصلی فایل تعریف شده‌اند)
  // به HTML. بدون این فیلتر، این فیلدها به‌صورت متن خام نمایش داده می‌شدند.
  eleventyConfig.addFilter("markdown", (value) =>
    value ? markdownIt.render(value) : ""
  );

  // داده‌ی سراسری ساده (برای فوتر و مشابه آن)
  eleventyConfig.addGlobalData("currentYear", () => new Date().getFullYear());

  // ---------------------------------------------------------------
  // Filterهای تاریخ ساده (بدون کتابخانه‌ی اضافه؛ در مرحله‌ی Design
  // System در صورت نیاز می‌توان با تقویم جلالی جایگزین کرد)
  // ---------------------------------------------------------------
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    if (!dateObj) return "";
    return new Date(dateObj).toLocaleDateString("fa-IR");
  });
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    if (!dateObj) return "";
    return new Date(dateObj).toISOString().split("T")[0];
  });

  // ---------------------------------------------------------------
  // Passthrough Copy — این فایل‌ها بدون پردازش، عیناً به خروجی کپی می‌شوند
  // ---------------------------------------------------------------
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // پوشه‌ی admin (باندل Decap CMS) عیناً کپی می‌شود؛ Eleventy نباید
  // فایل‌های آن را به‌عنوان قالب تفسیر کند.
  eleventyConfig.addPassthroughCopy({ admin: "admin" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });

  // ---------------------------------------------------------------
  // Collections — هر پوشه‌ی محتوا دقیقاً همان مسیری‌ست که در
  // admin/config.yml هم به عنوان "folder" تعریف شده است.
  // ---------------------------------------------------------------
  eleventyConfig.addCollection("articles", (api) =>
    api.getFilteredByGlob("src/content/articles/*.md")
  );
  eleventyConfig.addCollection("shortClips", (api) =>
    api.getFilteredByGlob("src/content/short-clips/*.md")
  );
  eleventyConfig.addCollection("longVideos", (api) =>
    api.getFilteredByGlob("src/content/long-videos/*.md")
  );
  eleventyConfig.addCollection("courses", (api) =>
    api.getFilteredByGlob("src/content/courses/*.md")
  );
  eleventyConfig.addCollection("services", (api) =>
    api.getFilteredByGlob("src/content/services/*.md")
  );

  // یک Collection ترکیبی برای صفحه‌ی «دانش» (مقاله + کلیپ کوتاه + ویدئوی بلند)
  eleventyConfig.addCollection("knowledge", (api) =>
    api.getFilteredByGlob([
      "src/content/articles/*.md",
      "src/content/short-clips/*.md",
      "src/content/long-videos/*.md",
    ])
  );

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site",
    },
    // فعلاً فقط Markdown و Nunjucks لازم داریم؛ چیز اضافه‌ای اضافه نمی‌کنیم.
    templateFormats: ["md", "njk"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
