import React from "react";

const bannerConfig = {
  logo: "TaskFlow.ai",
  title: "AI-Powered Task Management System",
  author: "Debopriyo Roy",
  description: "An intelligent task management and allocation system that uses AI to recommend the best employee for each task based on skills, performance, and workload.",
  author_github: "https://github.com/deca109",
  repo_url: "ErikSimson/Taskflow.ai",
  github: "https://github.com/deca109/Taskflow.ai",
  license: "MIT"
};

const Banner = () => {
  const {
    logo,
    title,
    author,
    description,
    author_github,
    github,
    license,
  } = bannerConfig;

  return (
    <div className="banner-container">
      <div className="banner-grid">
        {/* Logo and Description Section */}
        <div className="banner-logo-section">
          <div className="banner-logo">
            <div className="logo-text">
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="logo-link"
              >
                {logo}
              </a>
            </div>
          </div>
          <div className="banner-title">{title}</div>
          <div className="banner-description">{description}</div>
          <div className="banner-license">License: {license}</div>
        </div>

        <div className="banner-divider" />

        {/* Author Section */}
        <div className="banner-author-section">
          <span className="section-heading">Project Author</span>
          <div className="author-link">
            <a href={author_github} className="hover-link">
              {author}
            </a>
          </div>
        </div>

        <div className="banner-divider" />

        {/* Links Section */}
        <div className="banner-links-section">
          <span className="section-heading">Links</span>
          <a href={github} className="hover-link">
            Source code
          </a>
          <a href={`${github}#readme`} className="hover-link">
            Documentation
          </a>
          <a href={`${github}/issues/new`} className="hover-link">
            Report an Issue
          </a>
        </div>
      </div>
    </div>
  );
};

export default Banner;