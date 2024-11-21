import Image from 'next/image'
import { FaGithub, FaTwitter } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'

export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative pt-16 pb-32 overflow-hidden">
        <div className="relative">
          <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24">
            <div className="px-4 max-w-xl mx-auto sm:px-6 lg:py-16 lg:max-w-none lg:mx-0 lg:px-0">
              <div>
                <div className="mt-6">
                  <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                    雪桜さゆ
                    <span className="block text-2xl mt-2 text-gray-500">Yuki Sakura Sayu</span>
                  </h1>
                  <p className="mt-4 text-lg text-gray-500">
                    こんにちは！我是雪桜さゆ，一名跨性别女性程序员，现居日本。
                    作为一名热爱技术的开发者，我专注于Web开发领域，同时对各种知识都充满好奇和热情。
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-12 sm:mt-16 lg:mt-0">
              <div className="pl-4 -mr-48 sm:pl-6 md:-mr-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
                {/* 这里可以放置个人照片或者头像 */}
                <div className="w-full h-96 bg-gradient-to-r from-blue-100 to-pink-100 rounded-xl shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="bg-white bg-opacity-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">技术技能</h2>
            <p className="mt-4 text-lg text-gray-500">
              在技术领域，我擅长使用现代Web技术栈，同时也熟悉传统开发语言。
              我相信技术不仅仅是工具，更是实现创意和解决问题的媒介。
            </p>
          </div>
          <dl className="mt-12 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-8">
            {[
              { name: '前端开发', items: ['TypeScript/JavaScript', 'React.js & Next.js', 'Vue.js & Nuxt.js', 'HTML5 & CSS3', 'Tailwind CSS'] },
              { name: '后端开发', items: ['Node.js & Express', 'Java & Spring Boot', 'RESTful API设计', '数据库设计', '服务器部署'] },
              { name: '其他技能', items: ['Git版本控制', '敏捷开发', '技术文档写作', '项目管理', '团队协作'] }
            ].map((skill) => (
              <div key={skill.name} className="relative">
                <dt>
                  <p className="text-lg leading-6 font-medium text-gray-900">{skill.name}</p>
                </dt>
                <dd className="mt-2 text-base text-gray-500">
                  <ul className="list-disc list-inside space-y-1">
                    {skill.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Interests Section */}
      <div className="relative bg-gradient-to-r from-blue-50 to-pink-50 py-16 sm:py-24">
        <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:gap-24 lg:items-start">
          <div className="relative sm:py-16 lg:py-0">
            <div className="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-0 lg:max-w-none">
              <div className="relative rounded-2xl shadow-xl overflow-hidden">
                <div className="relative bg-white px-6 py-8">
                  <div className="prose prose-indigo prose-lg text-gray-500">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">兴趣爱好</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-lg font-semibold mb-2">技术探索</h4>
                        <ul className="list-disc list-inside space-y-1">
                          <li>开源项目贡献</li>
                          <li>技术博客写作</li>
                          <li>新技术学习</li>
                          <li>技术分享</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-2">其他兴趣</h4>
                        <ul className="list-disc list-inside space-y-1">
                          <li>文学阅读</li>
                          <li>哲学思考</li>
                          <li>科学探索</li>
                          <li>动漫文化</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-0">
            <div className="pt-12 sm:pt-16 lg:pt-20">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                探索与成长
              </h2>
              <div className="mt-6 text-gray-500 space-y-6">
                <p className="text-lg">
                  除了编程，我对文学、哲学、科学和动漫都有浓厚的兴趣。
                  我认为跨学科的知识积累能够带来更广阔的视角，帮助我在技术开发中找到创新的解决方案。
                </p>
                <p className="text-lg">
                  作为一个终身学习者，我始终保持着对新知识的渴望和探索精神。
                  我相信，只有不断学习和成长，才能在这个快速发展的技术世界中保持竞争力。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white bg-opacity-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">联系我</h2>
            <p className="mt-4 text-lg text-gray-500">
              如果您对技术开发、知识探索或者任何有趣的想法感兴趣，欢迎随时联系我！
            </p>
            <div className="mt-8 flex justify-center space-x-6">
              <a href="https://github.com/hositsuki" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">GitHub</span>
                <FaGithub className="h-8 w-8" />
              </a>
              <a href="https://twitter.com/DawnSayu" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <FaTwitter className="h-8 w-8" />
              </a>
              <a href="mailto:yukisakuranoyume@gmail.com" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Email</span>
                <MdEmail className="h-8 w-8" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
