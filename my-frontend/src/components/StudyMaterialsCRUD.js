import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Download, Search, X, Save, FileText, Calendar, User, Upload } from 'lucide-react';

const StudyMaterialsCRUD = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'create', 'edit'
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    materialName: '',
    materialDescription: '',
    userId: '68c515c79d7e6426d6777f59',
    studyMaterialDocument: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_BASE = 'http://localhost:5000/api/study-materials';

  // Helper function to log FormData contents
  const logFormData = (formDataObj, title) => {
    console.log(`=== ${title} ===`);
    for (let [key, value] of formDataObj.entries()) {
      if (value instanceof File) {
        console.log(`${key}:`, {
          name: value.name,
          size: value.size,
          type: value.type,
          lastModified: value.lastModified
        });
      } else {
        console.log(`${key}:`, value);
      }
    }
    console.log('==================');
  };

  // File handler function
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid file type (PDF, DOC, DOCX)');
        return;
      }
      
      if (file.size > maxSize) {
        setError('File size must be less than 10MB');
        return;
      }
      
      console.log('=== Selected File Details ===');
      console.log('File name:', file.name);
      console.log('File size:', file.size, 'bytes');
      console.log('File type:', file.type);
      console.log('============================');
      
      setSelectedFile(file);
      setFormData({...formData, studyMaterialDocument: file});
    }
  };

  // Fetch all materials
  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_BASE);
      if (!response.ok) throw new Error('Failed to fetch materials');
      const data = await response.json();
      setMaterials(data);
    } catch (err) {
      setError('Failed to load study materials');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // Create material with file upload
  const createMaterial = async () => {
    try {
      let payload;
      let headers = {};

      console.log('=== CREATE MATERIAL REQUEST ===');
      console.log('Form Data State:', formData);
      console.log('Selected File:', selectedFile);

      if (selectedFile) {
        // Use FormData for file upload
        const formDataPayload = new FormData();
        formDataPayload.append('userId', formData.userId);
        formDataPayload.append('materialName', formData.materialName);
        formDataPayload.append('materialDescription', formData.materialDescription);
        formDataPayload.append('studyMaterialDocument', selectedFile);
        
        // Log FormData contents
        logFormData(formDataPayload, 'CREATE REQUEST - FormData Payload');
        
        payload = formDataPayload;
        // Don't set Content-Type for FormData, let browser set it with boundary
      } else {
        // Use JSON for data without file
        const jsonPayload = {
          userId: "68c515c79d7e6426d6777f59",
          materialName: formData.materialName,
          materialDescription: formData.materialDescription,
          studyMaterialDocument: null
        };
        
        console.log('=== CREATE REQUEST - JSON Payload ===');
        console.log(JSON.stringify(jsonPayload, null, 2));
        console.log('=====================================');
        
        payload = JSON.stringify(jsonPayload);
        headers['Content-Type'] = 'application/json';
      }

      console.log('Request Headers:', headers);
      console.log('Request URL:', API_BASE);
      console.log('Request Method: POST');
      console.log('===============================');

      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: headers,
        body: payload
      });

      if (!response.ok) throw new Error('Failed to create material');
      
      const responseData = await response.json();
      console.log('=== CREATE RESPONSE ===');
      console.log('Response Status:', response.status);
      console.log('Response Data:', responseData);
      console.log('======================');
      
      setSuccess('Material created successfully!');
      fetchMaterials();
      closeModal();
    } catch (err) {
      console.error('=== CREATE ERROR ===');
      console.error('Error:', err);
      console.error('====================');
      setError('Failed to create material');
    }
  };

  // Update material with file upload (includes ID in PUT request)
  const updateMaterial = async () => {
    try {
      let payload;
      let headers = {};

      console.log('=== UPDATE MATERIAL REQUEST ===');
      console.log('Material ID:', selectedMaterial._id);
      console.log('Form Data State:', formData);
      console.log('Selected File:', selectedFile);

      if (selectedFile) {
        // Use FormData for file upload
        const formDataPayload = new FormData();
        formDataPayload.append('id', selectedMaterial._id); // Add ID for PUT request
        formDataPayload.append('userId', formData.userId);
        formDataPayload.append('materialName', formData.materialName);
        formDataPayload.append('materialDescription', formData.materialDescription);
        formDataPayload.append('studyMaterialDocument', selectedFile);
        
        // Log FormData contents
        logFormData(formDataPayload, 'UPDATE REQUEST - FormData Payload');
        
        payload = formDataPayload;
        // Don't set Content-Type for FormData
      } else {
        // Use JSON for data without file
        const jsonPayload = {
          id: selectedMaterial._id, // Include ID in PUT request
          userId: "68c515c79d7e6426d6777f59",
          materialName: formData.materialName,
          materialDescription: formData.materialDescription,
          studyMaterialDocument: formData.studyMaterialDocument || null
        };
        
        console.log('=== UPDATE REQUEST - JSON Payload ===');
        console.log(JSON.stringify(jsonPayload, null, 2));
        console.log('=====================================');
        
        payload = JSON.stringify(jsonPayload);
        headers['Content-Type'] = 'application/json';
      }

      console.log('Request Headers:', headers);
      console.log('Request URL:', `${API_BASE}/${selectedMaterial._id}`);
      console.log('Request Method: PUT');
      console.log('===============================');

      const response = await fetch(`${API_BASE}/${selectedMaterial._id}`, {
        method: 'PUT',
        headers: headers,
        body: payload
      });

      if (!response.ok) throw new Error('Failed to update material');
      
      const responseData = await response.json();
      console.log('=== UPDATE RESPONSE ===');
      console.log('Response Status:', response.status);
      console.log('Response Data:', responseData);
      console.log('======================');
      
      setSuccess('Material updated successfully!');
      fetchMaterials();
      closeModal();
    } catch (err) {
      console.error('=== UPDATE ERROR ===');
      console.error('Error:', err);
      console.error('====================');
      setError('Failed to update material');
    }
  };

  // Delete material
  const deleteMaterial = async (id) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;
    try {
      console.log('=== DELETE REQUEST ===');
      console.log('Material ID:', id);
      console.log('Request URL:', `${API_BASE}/${id}`);
      console.log('Request Method: DELETE');
      console.log('=====================');

      const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      
      if (!response.ok) throw new Error('Failed to delete material');
      
      console.log('=== DELETE RESPONSE ===');
      console.log('Response Status:', response.status);
      console.log('======================');
      
      setSuccess('Material deleted successfully!');
      fetchMaterials();
    } catch (err) {
      console.error('=== DELETE ERROR ===');
      console.error('Error:', err);
      console.error('====================');
      setError('Failed to delete material');
    }
  };

  // Modal handlers
  const openModal = (mode, material = null) => {
    console.log('=== OPENING MODAL ===');
    console.log('Mode:', mode);
    console.log('Material:', material);
    console.log('====================');
    
    setModalMode(mode);
    setSelectedMaterial(material);
    if (mode === 'create') {
      setFormData({ 
        materialName: '', 
        materialDescription: '', 
        userId: '',
        studyMaterialDocument: null 
      });
      setSelectedFile(null);
    } else if (mode === 'edit' && material) {
      setFormData({
        materialName: material.materialName,
        materialDescription: material.materialDescription,
        userId: material.userId,
        studyMaterialDocument: material.studyMaterialDocument
      });
      setSelectedFile(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log('=== CLOSING MODAL ===');
    setIsModalOpen(false);
    setSelectedMaterial(null);
    setSelectedFile(null);
    setFormData({ 
      materialName: '', 
      materialDescription: '', 
      userId: '',
      studyMaterialDocument: null 
    });
  };

  const handleSubmit = () => {
    console.log('=== FORM SUBMISSION ===');
    console.log('Modal Mode:', modalMode);
    console.log('Current Form Data:', formData);
    console.log('Selected File:', selectedFile);
    console.log('======================');
    
    if (modalMode === 'create') {
      createMaterial();
    } else if (modalMode === 'edit') {
      updateMaterial();
    }
  };

  // Download handler
  const handleDownload = (material) => {
    console.log('=== DOWNLOAD REQUEST ===');
    console.log('Material:', material);
    console.log('Document URL:', material.studyMaterialDocument);
    console.log('=======================');
    
    if (material.studyMaterialDocument) {
      // Simulate download - in real app, this would be the actual document URL
      const link = document.createElement('a');
      link.href = material.studyMaterialDocument;
      link.download = `${material.materialName}.pdf`;
      link.click();
    }
  };

  // Filter materials based on search
  const filteredMaterials = materials.filter(material =>
    material.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.materialDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Clear messages after 3 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Study Materials Manager</h1>
          <button
            onClick={() => openModal('create')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add Material
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      {/* Materials Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <div key={material._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                    {material.materialName}
                  </h3>
                  {material.studyMaterialDocument && (
                    <div className="flex-shrink-0 ml-2">
                      <FileText className="text-blue-600" size={20} />
                    </div>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {material.materialDescription}
                </p>

                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <Calendar size={14} className="mr-1" />
                  {formatDate(material.createdAt)}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal('view', material)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => openModal('edit', material)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteMaterial(material._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {material.studyMaterialDocument && (
                    <button
                      onClick={() => handleDownload(material)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm transition-colors"
                    >
                      <Download size={14} />
                      Download
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredMaterials.length === 0 && !loading && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first study material'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => openModal('create')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Add Material
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">
                {modalMode === 'view' && 'Material Details'}
                {modalMode === 'create' && 'Create New Material'}
                {modalMode === 'edit' && 'Edit Material'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {modalMode === 'view' && selectedMaterial && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Material Name</label>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      {selectedMaterial.materialName}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <div className="bg-gray-50 p-3 rounded-lg min-h-[100px]">
                      {selectedMaterial.materialDescription}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                      <div className="bg-gray-50 p-3 rounded-lg flex items-center">
                        <User size={16} className="mr-2 text-gray-500" />
                        {selectedMaterial.userId}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Created At</label>
                      <div className="bg-gray-50 p-3 rounded-lg flex items-center">
                        <Calendar size={16} className="mr-2 text-gray-500" />
                        {formatDate(selectedMaterial.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Document Status</label>
                    <div className={`p-3 rounded-lg flex items-center justify-between ${
                      selectedMaterial.studyMaterialDocument ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-600'
                    }`}>
                      <div className="flex items-center">
                        <FileText size={16} className="mr-2" />
                        {selectedMaterial.studyMaterialDocument ? 'Document Available' : 'No Document'}
                      </div>
                      {selectedMaterial.studyMaterialDocument && (
                        <button
                          onClick={() => handleDownload(selectedMaterial)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
                        >
                          <Download size={14} />
                          Download
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {(modalMode === 'create' || modalMode === 'edit') && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Material Name *
                    </label>
                    <input
                      type="text"
                      value={formData.materialName}
                      onChange={(e) => setFormData({...formData, materialName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter material name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.materialDescription}
                      onChange={(e) => setFormData({...formData, materialDescription: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter material description"
                    />
                  </div>

                 

                  {/* File Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Study Material Document (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      {selectedFile ? (
                        <div className="space-y-3">
                          <FileText className="mx-auto h-8 w-8 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                            <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFile(null);
                              setFormData({...formData, studyMaterialDocument: null});
                              document.getElementById('file-upload').value = '';
                            }}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Remove file
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Upload className="mx-auto h-8 w-8 text-gray-400" />
                          <div>
                            <label htmlFor="file-upload" className="cursor-pointer">
                              <span className="text-blue-600 hover:text-blue-700 font-medium">Click to upload</span>
                              <span className="text-gray-500"> or drag and drop</span>
                            </label>
                            <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX up to 10MB</p>
                          </div>
                        </div>
                      )}
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {(modalMode === 'create' || modalMode === 'edit') && (
              <div className="flex justify-end gap-3 p-6 border-t">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Save size={16} />
                  {modalMode === 'create' ? 'Create' : 'Update'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyMaterialsCRUD;
