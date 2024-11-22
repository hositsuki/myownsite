import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { FaPen, FaList, FaComments, FaImage, FaCog } from 'react-icons/fa';

const adminMenuItems = [
  {
    title: '写文章',
    description: '创建新的博客文章',
    href: '/admin/posts/new',
    icon: FaPen,
  },
  {
    title: '文章管理',
    description: '管理所有博客文章',
    href: '/admin/posts',
    icon: FaList,
  },
  {
    title: '评论管理',
    description: '管理文章评论',
    href: '/admin/comments',
    icon: FaComments,
  },
  {
    title: '图片管理',
    description: '管理上传的图片',
    href: '/admin/images',
    icon: FaImage,
  },
  {
    title: '系统设置',
    description: '管理系统配置',
    href: '/admin/settings',
    icon: FaCog,
  },
];

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">管理后台</h1>
        <p className="mt-2 text-gray-600">管理您的博客内容和系统设置</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.href}
              className="relative overflow-hidden group hover:shadow-lg transition-all duration-300"
            >
              <Link href={item.href}>
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h2>
                      <p className="mt-1 text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
