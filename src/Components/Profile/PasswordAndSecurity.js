import React, { useState } from 'react';
import { Shield, Key, Smartphone, History, ChevronRight } from 'lucide-react';

const PasswordAndSecurity = ({ setView }) => {
  const [isTwoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const securityItems = [
    {
      icon: <Key className="h-5 w-5 dark:text-white" />,
      title: "Password",
      description: "Change Password",
      link: "PasswordChange"
    },
    {
      icon: <Smartphone className="h-5 w-5 dark:text-white" />,
      title: "Two-Factor Authentication",
      description: isTwoFactorEnabled ? "Currently enabled" : "Currently disabled",
      link: "PasswordAndSecurity",
      action: () => disableTwoFactor()
    }
  ];

  const handleItemClick = (e, link, action) => {
    e.preventDefault(); // Prevent default anchor behavior
    if (action) action(); // Call the action (e.g., disabling 2FA)
    setView(link);  // Trigger the view change with the link passed to it
  };

  const disableTwoFactor = () => {
    setTwoFactorEnabled(false);
    alert("Two-Factor Authentication has been disabled.");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">

        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Password & Security
            </h1>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your account security settings and protect your account
          </p>
        </div>

        {/* Security Options */}
        <div className="space-y-4">
          {securityItems.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div
                onClick={(e) => handleItemClick(e, item.link, item.action)}
                className="flex items-center justify-between p-4 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Security Tips */}
        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
          <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
            Security Tips
          </h3>
          <ul className="mt-2 text-sm text-yellow-700 dark:text-yellow-300 space-y-2">
            <li>• Use a strong, unique password</li>
            <li>• Enable two-factor authentication for extra security</li>
            <li>• Regularly check your login history for suspicious activity</li>
            <li>• Never share your password or security codes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PasswordAndSecurity;
