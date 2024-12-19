import { FaFileUpload } from 'react-icons/fa';

const FileInput = () => {
      return (
            <div className="flex items-center justify-center w-full bg-gray-100 p-4 border-2 border-dashed border-gray-300 rounded-lg shadow-sm hover:border-blue-500 transition">
                  <label
                        htmlFor="file-upload"
                        className="flex items-center space-x-2 text-gray-600 cursor-pointer"
                  >
                        <FaFileUpload className="text-xl" />
                        <span>Upload a file</span>
                  </label>
                  <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                  />
            </div>
      );
};

export default FileInput;
