import { Link } from 'react-router-dom';
import { Tag, User, LogOut, LayoutDashboard, Store } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user, profile, signOut } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
            <Tag size={28} />
            RwaDiscount
          </Link>

          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to={profile?.role === 'admin' ? '/admin' : profile?.role === 'merchant' ? '/merchant' : '/customer'}
                  className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                {profile?.role === 'customer' && (
                  <Link
                    to="/merchant-register"
                    className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <Store size={18} />
                    Become a Merchant
                  </Link>
                )}
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User size={18} className="text-blue-600" />
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium text-slate-900">{profile?.full_name}</p>
                      <p className="text-xs text-slate-500 capitalize">{profile?.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Sign Out"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="px-4 py-2 text-slate-700 hover:text-blue-600 font-medium transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
