import QRForm from './components/QRForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="bg-[#111827] flex items-center justify-center min-h-screen m-0">
      <QRForm />
      <ToastContainer position="bottom-left" />
    </div>
  );
}

export default App