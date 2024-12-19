import { FiUpload } from 'react-icons/fi';

const FileUploadButton = () => {

      return (
            <div className="flex items-center justify-center space-x-4">
                  <button
                        // onClick={handleClick}
                        className="flex w-full items-center justify-center p-4 bg-green-500 text-white rounded-lg shadow-md cursor-pointer hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105"
                  >
                        <FiUpload className="mr-2 text-xl" />
                        <span className="text-lg font-semibold">Upload</span>
                  </button>
            </div>
      );
};

export default FileUploadButton;
