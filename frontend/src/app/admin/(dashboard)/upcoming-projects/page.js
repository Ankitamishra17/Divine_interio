"use client";

import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  X,
  Upload,
  FolderOpen,
} from "lucide-react";
import { adminApi } from "@/lib/adminApi";

// =========================================================
// API CONFIG
// All requests go through adminApi, which has a safe fallback URL,
// so the address can no longer become ".../undefined/upcoming-projects".
// =========================================================

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const BACKEND_URL = API_BASE_URL.replace(/\/api\/?$/, "");

// Maximum detail/gallery images
const MAX_GALLERY_IMAGES = 50;

export default function UpcomingProjectsPage() {
  // Project list
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [alt, setAlt] = useState("");

  // Main image
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  // Gallery: new files, their blob previews, and existing images while editing
  const [detailImages, setDetailImages] = useState([]);
  const [detailPreviews, setDetailPreviews] = useState([]);
  const [existingDetailImages, setExistingDetailImages] = useState([]);

  // Edit / form
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fileInputRef = useRef(null);
  const detailFileInputRef = useRef(null);

  // =========================================================
  // GET ALL PROJECTS
  // =========================================================

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await adminApi.listUpcoming();
      setProjects(
        data?.success && Array.isArray(data.projects) ? data.projects : []
      );
    } catch (error) {
      console.error("Error fetching upcoming projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // =========================================================
  // IMAGE URL
  // =========================================================

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    return `${BACKEND_URL}${imagePath}`;
  };

  // =========================================================
  // MAIN IMAGE CHANGE
  // =========================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // =========================================================
  // GALLERY IMAGES CHANGE
  // =========================================================

  const handleDetailImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const clearInput = () => {
      if (detailFileInputRef.current) detailFileInputRef.current.value = "";
    };

    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validFiles.length !== files.length) {
      alert("Only image files are allowed");
    }

    if (!validFiles.length) {
      clearInput();
      return;
    }

    if (detailImages.length + validFiles.length > MAX_GALLERY_IMAGES) {
      const remaining = MAX_GALLERY_IMAGES - detailImages.length;
      alert(
        remaining > 0
          ? `You can select only ${remaining} more image${
              remaining > 1 ? "s" : ""
            }. Maximum ${MAX_GALLERY_IMAGES} images allowed.`
          : `Maximum ${MAX_GALLERY_IMAGES} images allowed.`
      );
      clearInput();
      return;
    }

    setDetailImages((prev) => [...prev, ...validFiles]);
    setDetailPreviews((prev) => [
      ...prev,
      ...validFiles.map((file) => URL.createObjectURL(file)),
    ]);

    clearInput();
  };

  const removeDetailImage = (index) => {
    setDetailPreviews((prev) => {
      const previewUrl = prev[index];
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      return prev.filter((_, i) => i !== index);
    });
    setDetailImages((prev) => prev.filter((_, i) => i !== index));
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    detailPreviews.forEach((url) => {
      if (url.startsWith("blob:")) URL.revokeObjectURL(url);
    });

    setTitle("");
    setAlt("");
    setImage(null);
    setPreview("");
    setDetailImages([]);
    setDetailPreviews([]);
    setExistingDetailImages([]);
    setEditingId(null);
    setShowForm(false);

    if (fileInputRef.current) fileInputRef.current.value = "";
    if (detailFileInputRef.current) detailFileInputRef.current.value = "";
  };

  const handleAddProject = () => {
    resetForm();
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // =========================================================
  // CREATE / UPDATE PROJECT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter project title");
      return;
    }

    if (!editingId && !image) {
      alert("Please select a project image");
      return;
    }

    if (!editingId && detailImages.length === 0) {
      alert("Please select at least 1 detail image");
      return;
    }

    if (detailImages.length > MAX_GALLERY_IMAGES) {
      alert(`Maximum ${MAX_GALLERY_IMAGES} detail images allowed`);
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("alt", alt.trim());

      if (image) formData.append("image", image);

      // If new gallery images are selected while editing, the backend replaces the old gallery
      detailImages.forEach((file) => {
        formData.append("gallery", file);
      });

      const data = editingId
        ? await adminApi.updateUpcoming(editingId, formData)
        : await adminApi.createUpcoming(formData);

      if (!data?.success) {
        throw new Error(data?.message || "Failed to save upcoming project");
      }

      const wasEditing = Boolean(editingId);

      await fetchProjects();
      resetForm();

      alert(
        wasEditing
          ? "Upcoming project updated successfully"
          : "Upcoming project added successfully"
      );
    } catch (error) {
      console.error("Save project error:", error);
      alert(error.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // EDIT PROJECT
  // =========================================================

  const handleEdit = (project) => {
    setEditingId(project.id);
    setTitle(project.title || "");
    setAlt(project.alt || "");

    setImage(null);
    setPreview(project.image ? getImageUrl(project.image) : "");

    let gallery = [];
    if (Array.isArray(project.gallery)) {
      gallery = project.gallery;
    } else if (typeof project.gallery === "string") {
      try {
        gallery = JSON.parse(project.gallery || "[]");
      } catch (error) {
        console.error("Invalid gallery JSON:", error);
        gallery = [];
      }
    }

    setExistingDetailImages(Array.isArray(gallery) ? gallery : []);
    setDetailImages([]);
    setDetailPreviews([]);

    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRemoveImage = () => {
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setImage(null);
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // =========================================================
  // DELETE PROJECT
  // =========================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this upcoming project?"
    );
    if (!confirmed) return;

    try {
      const data = await adminApi.deleteUpcoming(id);

      if (!data?.success) {
        throw new Error(data?.message || "Failed to delete project");
      }

      setProjects((prev) => prev.filter((project) => project.id !== id));
      alert("Project deleted successfully");
    } catch (error) {
      console.error("Delete project error:", error);
      alert(error.message || "Failed to delete project");
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen bg-[#F5EBE0] p-4 sm:p-5 md:p-8 lg:p-10">
      {/* HEADER */}
      <div className="mb-6 border-b border-[#3D1F0D]/10 pb-5 sm:mb-8 sm:pb-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C8972B]">
              <span className="h-px w-7 bg-[#C8972B]" />
              Manage Projects
            </p>

            <h1 className="text-2xl font-medium text-[#3D1F0D] sm:text-3xl md:text-4xl">
              New Trending Design
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6B6B6B]">
              Add and manage new trending interior projects. The Home Page
              automatically displays the latest 4 uploaded projects. Each
              project can contain up to 50 gallery images.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddProject}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3D1F0D] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#542b15] sm:w-auto"
          >
            <Plus size={18} />
            Add Project
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm sm:p-5">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#8A8178]">
            Total Projects
          </p>
          <p className="mt-3 text-3xl font-medium text-[#3D1F0D] sm:text-4xl">
            {projects.length}
          </p>
        </div>

        <div className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm sm:p-5">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#8A8178]">
            Home Page Display
          </p>
          <p className="mt-3 text-3xl font-medium text-[#3D1F0D] sm:text-4xl">
            {Math.min(projects.length, 4)}
            <span className="ml-2 text-base text-[#8A8178]">Latest</span>
          </p>
        </div>
      </div>

      {/* ADD / EDIT FORM */}
      {showForm && (
        <div className="mb-6 overflow-hidden rounded-2xl border border-[#3D1F0D]/10 bg-white shadow-sm sm:mb-8">
          <div className="flex items-center justify-between gap-3 border-b border-[#3D1F0D]/10 px-4 py-4 sm:px-5 md:px-6">
            <div>
              <h2 className="text-lg font-medium text-[#3D1F0D] sm:text-xl">
                {editingId ? "Edit Trending Design" : "Add Trending Design"}
              </h2>
              <p className="mt-1 text-sm text-[#777]">
                {editingId
                  ? "Update the project information below."
                  : "Upload a new project with its main image and gallery."}
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              aria-label="Close form"
              className="shrink-0 rounded-lg p-2 text-[#777] transition hover:bg-[#F5EBE0] hover:text-[#3D1F0D]"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-5 md:p-6">
            <div className="grid gap-5 sm:gap-6 lg:grid-cols-2">
              {/* LEFT SIDE */}
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#3D1F0D]">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Luxury Modular Kitchen"
                    className="w-full rounded-xl border border-[#3D1F0D]/15 bg-[#FFFCF8] px-4 py-3 text-sm text-[#3D1F0D] outline-none transition placeholder:text-gray-400 focus:border-[#C8972B]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#3D1F0D]">
                    Image Alt Text
                  </label>
                  <input
                    type="text"
                    value={alt}
                    onChange={(e) => setAlt(e.target.value)}
                    placeholder="Describe the main image for accessibility..."
                    className="w-full rounded-xl border border-[#3D1F0D]/15 bg-[#FFFCF8] px-4 py-3 text-sm text-[#3D1F0D] outline-none transition placeholder:text-gray-400 focus:border-[#C8972B]"
                  />
                  <p className="mt-2 text-xs text-[#888]">
                    Optional. Used as the main image alternative text.
                  </p>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div>
                {/* MAIN IMAGE */}
                <label className="mb-2 block text-sm font-medium text-[#3D1F0D]">
                  Main Project Image {!editingId && "*"}
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {preview ? (
                  <div className="relative h-[220px] overflow-hidden rounded-xl border border-[#3D1F0D]/10 sm:h-[280px]">
                    <img
                      src={preview}
                      alt={alt || title || "Project preview"}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute right-3 top-3 rounded-lg bg-white/90 p-2 text-red-600 shadow-sm transition hover:bg-white"
                      title="Remove image"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-[220px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#C8972B]/40 bg-[#FDF8F2] text-center transition hover:border-[#C8972B] hover:bg-[#F9F0E5] sm:h-[280px]"
                  >
                    <div className="mb-4 rounded-full bg-[#C8972B]/10 p-4 text-[#C8972B]">
                      <Upload size={28} />
                    </div>
                    <span className="px-4 text-sm font-medium text-[#3D1F0D]">
                      Click to upload project image
                    </span>
                    <span className="mt-1 px-4 text-xs text-[#888]">
                      JPG, PNG, WEBP, GIF or AVIF
                    </span>
                  </button>
                )}

                {preview && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#C8972B]"
                  >
                    <ImageIcon size={16} />
                    Change main image
                  </button>
                )}

                {/* GALLERY */}
                <div className="mt-7 border-t border-[#3D1F0D]/10 pt-6">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-[#3D1F0D]">
                      Detail Page Gallery *
                    </label>
                    <p className="mt-1 text-xs leading-relaxed text-[#888]">
                      Upload multiple images for the project detail page. You
                      can upload up to {MAX_GALLERY_IMAGES} images.
                    </p>
                  </div>

                  <input
                    ref={detailFileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleDetailImagesChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => detailFileInputRef.current?.click()}
                    disabled={detailImages.length >= MAX_GALLERY_IMAGES}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#C8972B]/40 bg-[#FDF8F2] px-4 py-4 text-sm font-medium text-[#3D1F0D] transition hover:border-[#C8972B] hover:bg-[#F9F0E5] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FolderOpen size={18} />
                    {detailImages.length >= MAX_GALLERY_IMAGES
                      ? `Maximum ${MAX_GALLERY_IMAGES} images selected`
                      : "Click to upload detail images"}
                  </button>

                  {/* NEW SELECTED IMAGES */}
                  {detailPreviews.length > 0 && (
                    <div className="mt-4">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-xs font-medium text-[#777]">
                          New Images
                        </p>
                        <span className="rounded-lg bg-[#C8972B]/10 px-2 py-1 text-xs font-medium text-[#9C7017]">
                          {detailImages.length}/{MAX_GALLERY_IMAGES}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {detailPreviews.map((src, index) => (
                          <div
                            key={`${src}-${index}`}
                            className="group relative aspect-square overflow-hidden rounded-xl border border-[#3D1F0D]/10 bg-[#F5EBE0]"
                          >
                            <img
                              src={src}
                              alt={`Detail image ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeDetailImage(index)}
                              className="absolute right-2 top-2 rounded-lg bg-white/90 p-1.5 text-red-600 shadow-sm transition hover:bg-white"
                              title="Remove image"
                            >
                              <X size={16} />
                            </button>
                            <div className="absolute bottom-2 left-2 rounded-md bg-[#3D1F0D]/80 px-2 py-1 text-[10px] text-white">
                              Image {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* EXISTING IMAGES */}
                  {editingId && existingDetailImages.length > 0 && (
                    <div className="mt-5">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-xs font-medium text-[#777]">
                          Existing Gallery
                        </p>
                        <span className="rounded-lg bg-[#3D1F0D]/5 px-2 py-1 text-xs text-[#777]">
                          {existingDetailImages.length} Images
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {existingDetailImages.map((img, index) => (
                          <div
                            key={`${img}-${index}`}
                            className="relative aspect-square overflow-hidden rounded-xl border border-[#3D1F0D]/10 bg-[#F5EBE0]"
                          >
                            <img
                              src={getImageUrl(img)}
                              alt={`Existing detail image ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute bottom-2 left-2 rounded-md bg-[#3D1F0D]/80 px-2 py-1 text-[10px] text-white">
                              Existing {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>

                      <p className="mt-3 text-xs text-[#999]">
                        Select new images above only if you want to replace the
                        existing gallery.
                      </p>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-[#888]">
                      {editingId ? "Optional when editing" : "Required"}
                    </span>
                    <span
                      className={
                        detailImages.length > 0 &&
                        detailImages.length <= MAX_GALLERY_IMAGES
                          ? "font-medium text-green-600"
                          : "text-[#999]"
                      }
                    >
                      {detailImages.length}/{MAX_GALLERY_IMAGES} selected
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* FORM BUTTONS */}
            <div className="mt-6 flex flex-wrap gap-3 border-t border-[#3D1F0D]/10 pt-5 sm:mt-7">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#3D1F0D] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#542b15] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
              >
                {saving ? (
                  "Saving..."
                ) : editingId ? (
                  <>
                    <Pencil size={17} />
                    Update Project
                  </>
                ) : (
                  <>
                    <Plus size={17} />
                    Add Project
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="flex-1 rounded-xl border border-[#3D1F0D]/15 px-6 py-3 text-sm font-medium text-[#3D1F0D] transition hover:bg-[#F5EBE0] disabled:opacity-60 sm:flex-none"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PROJECTS HEADER */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C8972B]">
            Uploaded Projects
          </p>
          <h2 className="mt-1 text-xl font-medium text-[#3D1F0D] sm:text-2xl">
            All New Trending Design
          </h2>
        </div>

        <div className="flex items-center gap-2 text-sm text-[#777]">
          <FolderOpen size={17} />
          {projects.length} Projects
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="rounded-2xl bg-white p-8 text-center text-[#777] sm:p-12">
          Loading projects...
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && projects.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#3D1F0D]/15 bg-white/60 p-8 text-center sm:p-14">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#C8972B]/10 text-[#C8972B]">
            <ImageIcon size={25} />
          </div>
          <h3 className="text-lg font-medium text-[#3D1F0D]">
            No upcoming projects yet
          </h3>
          <p className="mt-2 text-sm text-[#777]">
            Start by uploading your first upcoming project.
          </p>
          <button
            type="button"
            onClick={handleAddProject}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#3D1F0D] px-5 py-3 text-sm text-white transition hover:bg-[#542b15]"
          >
            <Plus size={17} />
            Add First Project
          </button>
        </div>
      )}

      {/* PROJECTS GRID */}
      {!loading && projects.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              {/* IMAGE */}
              <div className="relative h-48 overflow-hidden bg-[#EDE2D4] sm:h-56">
                {project.image ? (
                  <img
                    src={getImageUrl(project.image)}
                    alt={project.alt || project.title || "Upcoming project"}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[#999]">
                    <ImageIcon size={35} />
                  </div>
                )}

                <div className="absolute left-3 top-3 rounded-lg bg-[#3D1F0D]/85 px-3 py-1.5 text-xs font-medium text-white">
                  #{String(index + 1).padStart(2, "0")}
                </div>

                {index < 4 && (
                  <div className="absolute right-3 top-3 rounded-lg bg-[#C8972B] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                    Home Page
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-medium text-[#3D1F0D]">
                    {project.title}
                  </h3>

                  {Array.isArray(project.gallery) &&
                    project.gallery.length > 0 && (
                      <span className="shrink-0 rounded-lg bg-[#C8972B]/10 px-2 py-1 text-[10px] font-medium text-[#9C7017]">
                        {project.gallery.length} Images
                      </span>
                    )}
                </div>

                {project.description && (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#777]">
                    {project.description}
                  </p>
                )}

                <div className="mt-5 flex gap-3 border-t border-[#3D1F0D]/10 pt-4">
                  <button
                    type="button"
                    onClick={() => handleEdit(project)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#C8972B]/30 bg-[#C8972B]/5 px-3 py-2.5 text-sm font-medium text-[#9C7017] transition hover:bg-[#C8972B]/10 sm:px-4"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(project.id)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100 sm:flex-none sm:px-4"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}