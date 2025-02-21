import React from "react";

const bannerConfig = {
  logo: "TaskFlow.ai",
  title: "AI-Powered Task Management System",
  authors: [
    {
      name: "Debopriyo Roy",
      github: "https://github.com/deca109"
    },
    {
      name: "Shweta Rani Sahoo",
      github: "https://github.com/Shwetarani45005"
    },
    {
      name: "Aniket Roy",
      github: "https://github.com/Aniket200000"
    }
  ],
  description:
    "An intelligent task management and allocation system that uses AI to recommend the best employee for each task based on skills, performance, and workload.",
  repo_url: "ErikSimson/Taskflow.ai",
  github: "https://github.com/deca109/Taskflow.ai",
  license: "MIT",
};

const Banner = () => {
  const { logo, title, authors, description, github, license } = bannerConfig;

  return (
    <div className="bottom-0 w-full bg-white rounded-lg text-gray-800 p-6 shadow-lg border-t border-indigo-600 radius-tl-3xl border-radius-3xl mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
        {/* Logo and Description Section */}
        <div>
          <h1 className="text-3xl text-indigo-600 font-bold mb-2">
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              {logo}
            </a>
          </h1>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-gray-600 mt-2">{description}</p>
          <p className="mt-2 font-medium">License: {license}</p>
        </div>

        {/* Authors Section */}
        <div>
          <h3 className="text-lg font-semibold">Project Authors</h3>
          <div className="flex flex-col space-y-2 mt-2">
            {authors.map((author, index) => (
              <a
                key={index}
                href={author.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                {author.name}
              </a>
            ))}
          </div>
        </div>

        {/* Links Section */}
        <div>
          <h3 className="text-lg font-semibold">Links</h3>
          <div className="flex flex-col space-y-2 mt-2">
            <a href={github} className="text-indigo-600 hover:underline">
              Source Code
            </a>
            <a
              href={`${github}#readme`}
              className="text-indigo-600 hover:underline"
            >
              Documentation
            </a>
            <a
              href={`${github}/issues/new`}
              className="text-indigo-600 hover:underline"
            >
              Report an Issue
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
