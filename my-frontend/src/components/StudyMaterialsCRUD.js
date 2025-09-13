import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, ExternalLink, Search, X, Save, FileText, Calendar, User, Link } from 'lucide-react';

const StudyMaterialsCRUD = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'create', 'edit'
  const [formData, setFormData] = useState({
    materialName: '',
    materialDescription: '',
    userId: '68c515c79d7e6426d6777f59',
    studyMaterialLink: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_BASE = 'http://localhost:5000/api/study-materials';

  // Validate URL format
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
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

  // Create material
  const createMaterial = async () => {
    try {
      // Validate required fields
      if (!formData.materialName.trim() || !formData.materialDescription.trim()) {
        setError('Material name and description are required');
        return;
      }

      // Validate URL if provided
      if (formData.studyMaterialLink && !isValidUrl(formData.studyMaterialLink)) {
        setError('Please enter a valid URL');
        return;
      }

      console.log('=== CREATE MATERIAL REQUEST ===');
      console.log('Form Data:', formData);

      const payload = {
        userId: formData.userId,
        materialName: formData.materialName.trim(),
        materialDescription: formData.materialDescription.trim(),
        studyMaterialLink: formData.studyMaterialLink.trim() || null
      };

      console.log('Request Payload:', payload);

      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to create material');
      
      const responseData = await response.json();
      console.log('Response:', responseData);
      
      setSuccess('Material created successfully!');
      fetchMaterials();
      closeModal();
    } catch (err) {
      console.error('Create Error:', err);
      setError('Failed to create material');
    }
  };

  // Update material
  const updateMaterial = async () => {
    try {
      // Validate required fields
      if (!formData.materialName.trim() || !formData.materialDescription.trim()) {
        setError('Material name and description are required');
        return;
      }

      // Validate URL if provided
      if (formData.studyMaterialLink && !isValidUrl(formData.studyMaterialLink)) {
        setError('Please enter a valid URL');
        return;
      }

      console.log('=== UPDATE MATERIAL REQUEST ===');
      console.log('Material ID:', selectedMaterial._id);
      console.log('Form Data:', formData);

      const payload = {
        id: selectedMaterial._id,
        userId: formData.userId,
        materialName: formData.materialName.trim(),
        materialDescription: formData.materialDescription.trim(),
        studyMaterialLink: formData.studyMaterialLink.trim() || null
      };

      console.log('Request Payload:', payload);

      const response = await fetch(`${API_BASE}/${selectedMaterial._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to update material');
      
      const responseData = await response.json();
      console.log('Response:', responseData);
      
      setSuccess('Material updated successfully!');
      fetchMaterials();
      closeModal();
    } catch (err) {
      console.error('Update Error:', err);
      setError('Failed to update material');
    }
  };

  // Delete material
  const deleteMaterial = async (id) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;
    try {
      console.log('=== DELETE REQUEST ===');
      console.log('Material ID:', id);

      const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      
      if (!response.ok) throw new Error('Failed to delete material');
      
      console.log('Delete successful');
      
      setSuccess('Material deleted successfully!');
      fetchMaterials();
    } catch (err) {
      console.error('Delete Error:', err);
      setError('Failed to delete material');
    }
  };

  // Modal handlers
  const openModal = (mode, material = null) => {
    console.log('=== OPENING MODAL ===');
    console.log('Mode:', mode);
    console.log('Material:', material);
    
    setModalMode(mode);
    setSelectedMaterial(material);
    if (mode === 'create') {
      setFormData({ 
        materialName: '', 
        materialDescription: '', 
        userId: '68c515c79d7e6426d6777f59',
        studyMaterialLink: ''
      });
    } else if (mode === 'edit' && material) {
      setFormData({
        materialName: material.materialName,
        materialDescription: material.materialDescription,
        userId: material.userId,
        studyMaterialLink: material.studyMaterialLink || ''
      });
    }
    setIsModalOpen(true);
    setError('');
  };

  const closeModal = () => {
    console.log('=== CLOSING MODAL ===');
    setIsModalOpen(false);
    setSelectedMaterial(null);
    setFormData({ 
      materialName: '', 
      materialDescription: '', 
      userId: '68c515c79d7e6426d6777f59',
      studyMaterialLink: ''
    });
    setError('');
  };

  const handleSubmit = () => {
    console.log('=== FORM SUBMISSION ===');
    console.log('Modal Mode:', modalMode);
    console.log('Current Form Data:', formData);
    
    if (modalMode === 'create') {
      createMaterial();
    } else if (modalMode === 'edit') {
      updateMaterial();
    }
  };

  // Open link handler
  const handleOpenLink = (material) => {
    console.log('=== OPEN LINK REQUEST ===');
    console.log('Material:', material);
    console.log('Link URL:', material.studyMaterialLink);
    
    if (material.studyMaterialLink) {
      window.open(material.studyMaterialLink, '_blank', 'noopener,noreferrer');
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
                  {material.studyMaterialLink && (
                    <div className="flex-shrink-0 ml-2">
                      <Link className="text-blue-600" size={20} />
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

                  {material.studyMaterialLink && (
                    <button
                      onClick={() => handleOpenLink(material)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm transition-colors"
                    >
                      <ExternalLink size={14} />
                      Open Link
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Study Material Link</label>
                    <div className={`p-3 rounded-lg flex items-center justify-between ${
                      selectedMaterial.studyMaterialLink ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-600'
                    }`}>
                      <div className="flex items-center">
                        <Link size={16} className="mr-2" />
                        {selectedMaterial.studyMaterialLink ? (
                          <span className="break-all">{selectedMaterial.studyMaterialLink}</span>
                        ) : (
                          'No Link Provided'
                        )}
                      </div>
                      {selectedMaterial.studyMaterialLink && (
                        <button
                          onClick={() => handleOpenLink(selectedMaterial)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center gap-1 text-sm ml-2 flex-shrink-0"
                        >
                          <ExternalLink size={14} />
                          Open
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Study Material Link (Optional)
                    </label>
                    <div className="relative">
                      <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="url"
                        value={formData.studyMaterialLink}
                        onChange={(e) => setFormData({...formData, studyMaterialLink: e.target.value})}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com/document.pdf"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Enter a direct link to your study material (Google Drive, Dropbox, website, etc.)
                    </p>
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