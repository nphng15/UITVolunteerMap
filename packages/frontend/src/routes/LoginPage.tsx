import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '@/hooks/useAuth';

import FloatingInput from '@/components/ui/FloatingInput';

import EyeIcon from '@/assets/icons/eye.svg';


export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

return (
    <div className="min-h-screen bg-gradient-to-b from-[#0480BA] to-[#023A54] flex items-center justify-center">
      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-[720px] h-[559px] bg-white rounded-[40px] shadow-md"
      >
        {/* Header Logo */}
        <div className="absolute top-[80px] left-1/2 -translate-x-1/2 flex items-start gap-1">
          <div className="w-6 h-6 bg-[#4D5358]" />
          <div className="flex flex-col items-end">
            <div className="text-[48px] font-bold leading-[52.8px] text-[#697077]">
              UITVolunteer
            </div>
            <div className="text-[24px] font-normal leading-[33.6px] text-[#697077]">
              xxxxxxxxxxx
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="absolute top-[193px] left-1/2 -translate-x-1/2 w-[560px] text-center text-[42px] font-bold leading-[46px] text-[#21272A]">
          Đăng nhập
        </div>

        {/* Error */}
        {error && (
          <div className="absolute top-[240px] left-1/2 -translate-x-1/2 w-[560px] text-center text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Username */}
        <div className="absolute top-[269px] left-1/2 -translate-x-1/2 w-[560px]">
          <FloatingInput
            label="Tên đăng nhập"
            value={username}
            onChange={setUsername}
            disabled={isSubmitting}
          />
        </div>

        {/* Password */}
        <div className="absolute top-[349px] left-1/2 -translate-x-1/2 relative w-[560px]">
          <FloatingInput
            label="Mật khẩu"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={setPassword}
            disabled={isSubmitting}
          />

          {/* Eye button */}
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6"
          >
            <div className="relative w-6 h-6">
              {/* Eye icon */}
              <img src={EyeIcon} alt="eye" className="w-6 h-6" />

              {/* Slash when hidden */}
              {!showPassword && (
                <div className="absolute left-0 top-1/2 w-full h-[2px] bg-[#21272A] rotate-[-45deg]" />
              )}
            </div>
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="absolute top-[429px] left-1/2 -translate-x-1/2 w-[560px] h-[50px]
            rounded-lg bg-[#023A54]
            text-white font-bold text-[20px]
            hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}
        </button>

        {/* Divider */}
        <div className="absolute bottom-[40px] left-1/2 -translate-x-1/2 w-[560px] border-t border-[#DDE1E6]" />
      </form>
    </div>
  );
}