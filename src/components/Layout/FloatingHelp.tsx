import React, { useState } from 'react';
import { HelpCircle, X, MessageCircle, Phone, Mail, ExternalLink } from 'lucide-react';
import FloatingActionButton from '../UI/FloatingActionButton';
import Button from '../UI/Button';

const FloatingHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const helpOptions = [
    {
      icon: MessageCircle,
      title: 'دردشة مباشرة',
      description: 'تحدث مع فريق الدعم',
      action: () => console.log('Open chat'),
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      icon: Phone,
      title: 'اتصل بنا',
      description: '+963 11 123 4567',
      action: () => window.open('tel:+963111234567'),
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      icon: Mail,
      title: 'راسلنا',
      description: 'support@sharimostaamal.com',
      action: () => window.open('mailto:support@sharimostaamal.com'),
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      icon: ExternalLink,
      title: 'مركز المساعدة',
      description: 'الأسئلة الشائعة والأدلة',
      action: () => console.log('Open help center'),
      color: 'bg-orange-600 hover:bg-orange-700',
    },
  ];

  return (
    <>
      {/* Floating Help Button */}
      <FloatingActionButton
        icon={isOpen ? X : HelpCircle}
        variant="primary"
        size="lg"
        position="bottom-left"
        label="مساعدة"
        onClick={() => setIsOpen(!isOpen)}
      />

      {/* Help Menu */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-80 z-50 animate-in slide-in-from-bottom-5">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">كيف يمكننا مساعدتك؟</h3>
            <p className="text-sm text-gray-600">اختر الطريقة المناسبة للتواصل معنا</p>
          </div>

          <div className="space-y-3">
            {helpOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <Button
                  variant="ghost"
                  size="md"
                  icon={Icon}
                  iconPosition="left"
                  fullWidth
                  key={index}
                  onClick={() => {
                    option.action();
                    setIsOpen(false);
                  }}
                  className="justify-start text-right"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{option.title}</p>
                    <p className="text-xs text-gray-600">{option.description}</p>
                  </div>
                </Button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              متوفرون 24/7 لخدمتكم
            </p>
          </div>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default FloatingHelp;