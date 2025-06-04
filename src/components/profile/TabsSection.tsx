import { component$, useSignal, $, useStore } from "@builder.io/qwik";
import type * as v from "valibot";
import { useForm, formAction$, valiForm$ } from "@modular-forms/qwik";
import type { Signal } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import type { JSONObject } from "@builder.io/qwik-city";
import { userSchema, type UpdateUserForm } from "~/api/Forms";
import { updateProfileForm } from "~/api/Forms";
import type { UserProfileType } from "~/routes/profile/types";
import {
  CalendarIcon as Calendar,
  UserPlusIcon as UserPlus,
  BellIcon as Bell,
  ClockIcon as Clock,
  BookmarkIcon as Bookmark,
  UserIcon as User,
  PencilIcon as Pencil,
  CameraIcon as Camera,
  CheckIcon as Check,
  XIcon as X,
} from "lucide-qwik";
import type { DetailedEventType, PlaceType } from "~/routes/profile/types";
import { EventCard } from "./EventCard";
import { PlaceCard } from "./PlaceCard";
import { EmptyState } from "./EmptyState";

type ProfileSchemaType = v.InferInput<typeof userSchema>;
type ActiveRequestType = any; // Temporary type definition

// Function to update profile form (to be implemented)
// Define form action for profile updates
export const useUpdateProfileAction = formAction$<UpdateUserForm>(
  async (values, event) => {
    try {
      // Convert values to the format expected by the backend
      const formData = {
        Name: values.Name,
        Description: values.Description,
        Username: values.Username,
        ImageURL: values.ImageURL || undefined,
        Intrests: values.Intrests,
      };
      console.log("hi", formData);

      const result = await updateProfileForm(formData as JSONObject, event);

      if (!result.success) {
        return {
          status: "error" as const,
          message: "Failed to update profile",
        };
      }

      return {
        status: "success" as const,
        message: "Profile updated successfully",
      };
    } catch (error) {
      return {
        status: "error" as const,
        message: "An unexpected error occurred",
      };
    }
  },
  valiForm$(userSchema),
);
// Define props interface for ProfileView component
interface ProfileViewProps {
  profileData: UserProfileType;
  isEditing: Signal<boolean>;
}

// Profile View component
const ProfileView = component$<ProfileViewProps>(
  ({ profileData, isEditing }) => {
    return (
      <div class="flex flex-col rounded-lg bg-white p-4 shadow-sm sm:p-6 md:p-8">
        {/* Profile header with avatar and basic info */}
        <div class="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
          {/* Avatar container - centered on mobile, left-aligned on desktop */}
          <div class="relative flex justify-center md:justify-start">
            <div class="h-32 w-32 overflow-hidden rounded-full border-4 border-[#D98E73] bg-[#F8D7BD] shadow-md">
              <img
                src={profileData.avatar}
                alt="Profile avatar"
                class="h-full w-full object-cover"
                width={128}
                height={128}
                onError$={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/placeholder-avatar.svg";
                }}
              />
            </div>
          </div>

          {/* Profile info container - takes remaining width */}
          <div class="flex w-full flex-1 flex-col text-center md:text-left">
            {/* Name, username and edit button */}
            <div class="flex flex-col items-center space-y-2 md:flex-row md:items-start md:justify-between md:space-y-0">
              <div>
                <h2 class="mb-1 text-2xl font-bold text-[#5B3E29]">
                  {profileData.name}
                </h2>
                <p class="text-[#D98E73]">@{profileData.username}</p>
                <p class="mt-2 text-sm text-[#6D5D4E]">
                  Member since {profileData.joinedDate}
                </p>
              </div>

              <button
                type="button"
                onClick$={() => {
                  isEditing.value = !isEditing.value;
                }}
                class="mx-auto mt-4 inline-flex h-10 items-center justify-center rounded-md bg-[#D98E73] px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-[#C27B62] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 md:mx-0 md:mt-0"
              >
                <Pencil class="mr-2 h-4 w-4" /> Edit Profile
              </button>
            </div>

            {/* Stats cards - single column on small screens, 3 columns on larger screens */}
            <div class="my-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              <div class="rounded-lg bg-[#FFF8F0] p-3 text-center shadow-sm transition-all hover:shadow-md">
                <span class="block text-xl font-bold text-[#D98E73] sm:text-2xl">
                  {}
                </span>
                <span class="text-xs text-[#6D5D4E] sm:text-sm">
                  Events Attended
                </span>
              </div>
              <div class="rounded-lg bg-[#FFF8F0] p-3 text-center shadow-sm transition-all hover:shadow-md">
                <span class="block text-xl font-bold text-[#D98E73] sm:text-2xl">
                  {}
                </span>
                <span class="text-xs text-[#6D5D4E] sm:text-sm">
                  Events Hosted
                </span>
              </div>
              <div class="rounded-lg bg-[#FFF8F0] p-3 text-center shadow-sm transition-all hover:shadow-md">
                <span class="block text-xl font-bold text-[#D98E73] sm:text-2xl">
                  {}
                </span>
                <span class="text-xs text-[#6D5D4E] sm:text-sm">
                  Places Found
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* About section */}
        <div class="mt-6 border-t border-[#F8EDE3] pt-6">
          <h3 class="mb-2 text-lg font-semibold text-[#5B3E29]">About Me</h3>
          <p class="whitespace-pre-line text-[#6D5D4E]">
            {profileData.bio || "No bio added yet."}
          </p>
        </div>

        {/* Skills section */}
        <div class="mt-6 border-t border-[#F8EDE3] pt-6">
          <h3 class="mb-3 text-lg font-semibold text-[#5B3E29]">
            Skills & Interests
          </h3>
          <div class="flex flex-wrap gap-2">
            {profileData.skills.length > 0 ? (
              profileData.skills.map((skill) => (
                <span
                  key={skill}
                  class="rounded-full bg-[#F8D7BD] px-3 py-1 text-sm text-[#8B5A2B] shadow-sm"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p class="text-sm italic text-[#6D5D4E]">
                No skills or interests added yet.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  },
);

// Define props interface for ProfileEdit component
interface ProfileEditProps {
  profileData: UserProfileType;
  isEditing: Signal<boolean>;
}

// Profile Edit component
const ProfileEdit = component$<ProfileEditProps>(
  ({ profileData, isEditing }) => {
    // Get the form action
    const updateProfileAction = useUpdateProfileAction();

    // Local state management within the component
    const editableProfile = useStore<UserProfileType>({
      name: profileData.name,
      username: profileData.username,
      bio: profileData.bio,
      avatar: profileData.avatar,
      skills: profileData.skills,
      joinedDate: profileData.joinedDate,
    });

    // Form state tracking
    const isSubmitting = useSignal(false);
    const formSuccess = useSignal(false);

    // Create the form with initial values from profileData
    const [form, { Form, Field }] = useForm<UpdateUserForm>({
      loader: {
        value: {
          Name: editableProfile.name,
          Username: editableProfile.username,
          Description: editableProfile.bio,
          ImageURL: editableProfile.avatar,
          Intrests: editableProfile.skills,
        },
      },
      action: updateProfileAction,
      validate: valiForm$(userSchema),
    });

    const newSkill = useSignal("");
    const validationErrors = useStore<
      Partial<Record<keyof ProfileSchemaType, string>>
    >({});

    // Self-contained functions
    const addSkill = $((arr: any) => {
      if (
        newSkill.value.trim() &&
        !editableProfile.skills.includes(newSkill.value.trim())
      ) {
        // Check max skills validation
        if (editableProfile.skills.length >= 20) {
          validationErrors["Intrests"] = "Maximum 20 skills allowed";
          return;
        }

        // Validate skill length
        if (newSkill.value.trim().length > 20) {
          validationErrors["Intrests"] =
            "Skill must be less than 20 characters";
          return;
        }

        editableProfile.skills = [
          ...editableProfile.skills,
          newSkill.value.trim(),
        ];
        arr.value = editableProfile.skills;
      }
    });

    const removeSkill = $((skill: string, field: any) => {
      editableProfile.skills = editableProfile.skills.filter(
        (s) => s !== skill,
      );
      // Update the form field value to reflect the changes
      field.value = editableProfile.skills;
      // Clear skill validation error when removing skills
      if (validationErrors["Intrests"]) {
        delete validationErrors["Intrests"];
      }
    });

    return (
      <div class="rounded-lg bg-white p-8 shadow-sm">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-[#5B3E29]">Edit Profile</h2>
          <div class="flex space-x-3">
            <button
              type="button"
              onClick$={() => {
                isEditing.value = false;
              }}
              class="rounded-md bg-white px-4 py-2 text-sm font-medium text-[#5B3E29] shadow-sm ring-1 ring-inset ring-[#E6D7C3] transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#D98E73] focus:ring-offset-2"
              disabled={isSubmitting.value}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="profile-edit-form"
              class={`rounded-md ${
                formSuccess.value ? "bg-green-600" : "bg-[#D98E73]"
              } px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors ${
                formSuccess.value ? "hover:bg-green-700" : "hover:bg-[#C27B62]"
              } focus:outline-none focus:ring-2 focus:ring-[#D98E73] focus:ring-offset-2`}
              disabled={isSubmitting.value}
            >
              {form.submitting ? (
                "Saving..."
              ) : form.response.status === "success" ? (
                <>
                  <Check class="mr-1 inline-block h-4 w-4" />
                  Saved!
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
        <Form
          id="profile-edit-form"
          onSubmit$={() => {
            if (form.submitted && !form.invalid) {
              isEditing.value = false;
              if (form.response.status === "success") {
                console.log("Profile updated successfully");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }
          }}
          class="flex flex-col space-y-6"
        >
          <div class="flex flex-col items-center md:flex-row md:items-start">
            <div class="relative mb-6 md:mb-0 md:mr-8">
              <div class="h-32 w-32 overflow-hidden rounded-full border-4 border-[#D98E73] bg-[#F8D7BD]">
                <img
                  src={profileData.avatar}
                  alt="Profile avatar"
                  class="h-full w-full object-cover"
                  width={128}
                  height={128}
                  onError$={(e) => {
                    (e.target as HTMLInputElement).src =
                      "/placeholder-avatar.svg";
                  }}
                />
              </div>
              <button
                type="button"
                class="absolute bottom-0 right-0 rounded-full bg-[#D98E73] p-2 text-white shadow-md transition-colors hover:bg-[#C27B62]"
              >
                <Camera class="h-5 w-5" />
              </button>
            </div>

            <div class="flex-1 space-y-4">
              <Field name="Name">
                {(field, props) => (
                  <div>
                    <label
                      class="mb-2 block font-medium text-[#5B3E29]"
                      for="Name"
                    >
                      Name
                    </label>
                    <input
                      {...props}
                      id="Name"
                      type="text"
                      value={field.value}
                      class={`w-full rounded-md border ${
                        field.error ? "border-red-500" : "border-[#E6D7C3]"
                      } bg-white px-4 py-2 text-[#5B3E29] shadow-sm focus:border-[#D98E73] focus:outline-none focus:ring-1 focus:ring-[#D98E73]`}
                    />
                    {field.error && (
                      <p class="mt-1 text-sm text-red-500">{field.error}</p>
                    )}
                  </div>
                )}
              </Field>

              <Field name="Username">
                {(field, props) => (
                  <div>
                    <label
                      class="mb-2 block font-medium text-[#5B3E29]"
                      for="Username"
                    >
                      Username
                    </label>
                    <input
                      {...props}
                      id="Username"
                      type="text"
                      value={field.value}
                      class={`w-full rounded-md border ${
                        field.error ? "border-red-500" : "border-[#E6D7C3]"
                      } bg-white px-4 py-2 text-[#5B3E29] shadow-sm focus:border-[#D98E73] focus:outline-none focus:ring-1 focus:ring-[#D98E73]`}
                    />
                    {field.error && (
                      <p class="mt-1 text-sm text-red-500">{field.error}</p>
                    )}
                  </div>
                )}
              </Field>
            </div>
          </div>

          <Field name="Description">
            {(field, props) => (
              <div>
                <label class="mb-2 block font-medium text-[#5B3E29]" for="bio">
                  About Me
                </label>
                <textarea
                  {...props}
                  id="bio"
                  value={field.value}
                  rows={4}
                  class={`w-full rounded-md border ${
                    field.error ? "border-red-500" : "border-[#E6D7C3]"
                  } bg-white px-4 py-2 text-[#5B3E29] shadow-sm focus:border-[#D98E73] focus:outline-none focus:ring-1 focus:ring-[#D98E73]`}
                />
                {field.error && (
                  <p class="mt-1 text-sm text-red-500">{field.error}</p>
                )}
              </div>
            )}
          </Field>

          <Field type="string[]" name="Intrests">
            {(field) => (
              <div>
                <label class="mb-2 block font-medium text-[#5B3E29]">
                  Skills & Interests
                </label>
                <div class="mb-4 flex flex-wrap gap-2">
                  {editableProfile.skills.map((skill) => (
                    <div
                      key={skill}
                      class="group flex items-center rounded-full bg-[#F8D7BD] px-3 py-1"
                    >
                      <span class="text-sm text-[#8B5A2B]">{skill}</span>
                      <button
                        type="button"
                        onClick$={() => removeSkill(skill, field)}
                        class="ml-1 rounded-full p-0.5 text-[#8B5A2B] opacity-70 transition-opacity hover:opacity-100"
                      >
                        <X class="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <div class="flex flex-col gap-2">
                  <div class="grid grid-cols-2 gap-2 md:grid-cols-3">
                    <label class="flex cursor-pointer items-center rounded-md border border-[#E6D7C3] bg-white p-2 transition-colors hover:bg-[#FFF8F0]">
                      <input
                        type="checkbox"
                        value="Networking"
                        onChange$={(e) => {
                          if ((e.target as HTMLInputElement).checked) {
                            newSkill.value = "Networking";
                            addSkill(field);
                          } else {
                            removeSkill("Networking", field);
                          }
                        }}
                        checked={editableProfile.skills.includes("Networking")}
                        class="mr-2 h-4 w-4 text-[#D98E73] focus:ring-[#D98E73]"
                      />
                      <span class="text-sm">Networking</span>
                    </label>
                    <label class="flex cursor-pointer items-center rounded-md border border-[#E6D7C3] bg-white p-2 transition-colors hover:bg-[#FFF8F0]">
                      <input
                        type="checkbox"
                        value="Web Development"
                        onChange$={(e) => {
                          if ((e.target as HTMLInputElement).checked) {
                            newSkill.value = "Web Development";
                            addSkill(field);
                          } else {
                            removeSkill("Web Development", field);
                          }
                        }}
                        checked={editableProfile.skills.includes(
                          "Web Development",
                        )}
                        class="mr-2 h-4 w-4 text-[#D98E73] focus:ring-[#D98E73]"
                      />
                      <span class="text-sm">Web Development</span>
                    </label>
                    <label class="flex cursor-pointer items-center rounded-md border border-[#E6D7C3] bg-white p-2 transition-colors hover:bg-[#FFF8F0]">
                      <input
                        type="checkbox"
                        value="Marketing"
                        onChange$={(e) => {
                          if ((e.target as HTMLInputElement).checked) {
                            newSkill.value = "Marketing";
                            addSkill(field);
                          } else {
                            removeSkill("Marketing", field);
                          }
                        }}
                        checked={editableProfile.skills.includes("Marketing")}
                        class="mr-2 h-4 w-4 text-[#D98E73] focus:ring-[#D98E73]"
                      />
                      <span class="text-sm">Marketing</span>
                    </label>
                    <label class="flex cursor-pointer items-center rounded-md border border-[#E6D7C3] bg-white p-2 transition-colors hover:bg-[#FFF8F0]">
                      <input
                        type="checkbox"
                        value="Startups"
                        onChange$={(e) => {
                          if ((e.target as HTMLInputElement).checked) {
                            newSkill.value = "Startups";
                            addSkill(field);
                          } else {
                            removeSkill("Startups", field);
                          }
                        }}
                        checked={editableProfile.skills.includes("Startups")}
                        class="mr-2 h-4 w-4 text-[#D98E73] focus:ring-[#D98E73]"
                      />
                      <span class="text-sm">Startups</span>
                    </label>
                    <label class="flex cursor-pointer items-center rounded-md border border-[#E6D7C3] bg-white p-2 transition-colors hover:bg-[#FFF8F0]">
                      <input
                        type="checkbox"
                        value="Graphic Design"
                        onChange$={(e) => {
                          if ((e.target as HTMLInputElement).checked) {
                            newSkill.value = "Graphic Design";
                            addSkill(field);
                          } else {
                            removeSkill("Graphic Design", field);
                          }
                        }}
                        checked={editableProfile.skills.includes(
                          "Graphic Design",
                        )}
                        class="mr-2 h-4 w-4 text-[#D98E73] focus:ring-[#D98E73]"
                      />
                      <span class="text-sm">Graphic Design</span>
                    </label>
                    <label class="flex cursor-pointer items-center rounded-md border border-[#E6D7C3] bg-white p-2 transition-colors hover:bg-[#FFF8F0]">
                      <input
                        type="checkbox"
                        value="Business Strategy"
                        onChange$={(e) => {
                          if ((e.target as HTMLInputElement).checked) {
                            newSkill.value = "Business Strategy";
                            addSkill(field);
                          } else {
                            removeSkill("Business Strategy", field);
                          }
                        }}
                        checked={editableProfile.skills.includes(
                          "Business Strategy",
                        )}
                        class="mr-2 h-4 w-4 text-[#D98E73] focus:ring-[#D98E73]"
                      />
                      <span class="text-sm">Business Strategy</span>
                    </label>
                    <label class="flex cursor-pointer items-center rounded-md border border-[#E6D7C3] bg-white p-2 transition-colors hover:bg-[#FFF8F0]">
                      <input
                        type="checkbox"
                        value="Remote Work"
                        onChange$={(e) => {
                          if ((e.target as HTMLInputElement).checked) {
                            newSkill.value = "Remote Work";
                            addSkill(field);
                          } else {
                            removeSkill("Remote Work", field);
                          }
                        }}
                        checked={editableProfile.skills.includes("Remote Work")}
                        class="mr-2 h-4 w-4 text-[#D98E73] focus:ring-[#D98E73]"
                      />
                      <span class="text-sm">Remote Work</span>
                    </label>
                    <label class="flex cursor-pointer items-center rounded-md border border-[#E6D7C3] bg-white p-2 transition-colors hover:bg-[#FFF8F0]">
                      <input
                        type="checkbox"
                        value="Productivity"
                        onChange$={(e) => {
                          if ((e.target as HTMLInputElement).checked) {
                            newSkill.value = "Productivity";
                            addSkill(field);
                          } else {
                            removeSkill("Productivity", field);
                          }
                        }}
                        checked={editableProfile.skills.includes(
                          "Productivity",
                        )}
                        class="mr-2 h-4 w-4 text-[#D98E73] focus:ring-[#D98E73]"
                      />
                      <span class="text-sm">Productivity</span>
                    </label>
                    <label class="flex cursor-pointer items-center rounded-md border border-[#E6D7C3] bg-white p-2 transition-colors hover:bg-[#FFF8F0]">
                      <input
                        type="checkbox"
                        value="Project Management"
                        onChange$={(e) => {
                          if ((e.target as HTMLInputElement).checked) {
                            newSkill.value = "Project Management";
                            addSkill(field);
                          } else {
                            removeSkill("Project Management", field);
                          }
                        }}
                        checked={editableProfile.skills.includes(
                          "Project Management",
                        )}
                        class="mr-2 h-4 w-4 text-[#D98E73] focus:ring-[#D98E73]"
                      />
                      <span class="text-sm">Project Management</span>
                    </label>
                    <label class="flex cursor-pointer items-center rounded-md border border-[#E6D7C3] bg-white p-2 transition-colors hover:bg-[#FFF8F0]">
                      <input
                        type="checkbox"
                        value="Digital Nomad"
                        onChange$={(e) => {
                          if ((e.target as HTMLInputElement).checked) {
                            newSkill.value = "Digital Nomad";
                            addSkill(field);
                          } else {
                            removeSkill("Digital Nomad", field);
                          }
                        }}
                        checked={editableProfile.skills.includes(
                          "Digital Nomad",
                        )}
                        class="mr-2 h-4 w-4 text-[#D98E73] focus:ring-[#D98E73]"
                      />
                      <span class="text-sm">Digital Nomad</span>
                    </label>
                    <label class="flex cursor-pointer items-center rounded-md border border-[#E6D7C3] bg-white p-2 transition-colors hover:bg-[#FFF8F0]">
                      <input
                        type="checkbox"
                        value="Content Creation"
                        onChange$={(e) => {
                          if ((e.target as HTMLInputElement).checked) {
                            newSkill.value = "Content Creation";
                            addSkill(field);
                          } else {
                            removeSkill("Content Creation", field);
                          }
                        }}
                        checked={editableProfile.skills.includes(
                          "Content Creation",
                        )}
                        class="mr-2 h-4 w-4 text-[#D98E73] focus:ring-[#D98E73]"
                      />
                      <span class="text-sm">Content Creation</span>
                    </label>
                    <label class="flex cursor-pointer items-center rounded-md border border-[#E6D7C3] bg-white p-2 transition-colors hover:bg-[#FFF8F0]">
                      <input
                        type="checkbox"
                        value="UI/UX Design"
                        onChange$={(e) => {
                          if ((e.target as HTMLInputElement).checked) {
                            newSkill.value = "UI/UX Design";
                            addSkill(field);
                          } else {
                            removeSkill("UI/UX Design", field);
                          }
                        }}
                        checked={editableProfile.skills.includes(
                          "UI/UX Design",
                        )}
                        class="mr-2 h-4 w-4 text-[#D98E73] focus:ring-[#D98E73]"
                      />
                      <span class="text-sm">UI/UX Design</span>
                    </label>
                  </div>
                </div>
                {field.error && (
                  <p class="mt-1 text-sm text-red-500">{field.error}</p>
                )}
                {validationErrors["Intrests"] && !field.error && (
                  <p class="mt-1 text-sm text-red-500">
                    {validationErrors["Intrests"]}
                  </p>
                )}
              </div>
            )}
          </Field>

          <div class="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick$={() => {
                isEditing.value = false;
              }}
              class="rounded-md bg-white px-4 py-2 text-sm font-medium text-[#5B3E29] shadow-sm ring-1 ring-inset ring-[#E6D7C3] transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#D98E73] focus:ring-offset-2"
              disabled={isSubmitting.value}
            >
              Cancel
            </button>
            <button
              type="submit"
              class={`rounded-md ${
                formSuccess.value ? "bg-green-600" : "bg-[#D98E73]"
              } px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors ${
                formSuccess.value ? "hover:bg-green-700" : "hover:bg-[#C27B62]"
              } focus:outline-none focus:ring-2 focus:ring-[#D98E73] focus:ring-offset-2`}
              disabled={isSubmitting.value}
            >
              {form.submitting ? (
                "Saving..."
              ) : form.response.status === "success" ? (
                <>
                  <Check class="mr-1 inline-block h-4 w-4" />
                  Saved!
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
          {form.response.message && (
            <div
              class={`mt-4 rounded-md p-3 ${
                form.response.status === "success"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {form.response.message}
            </div>
          )}
        </Form>
      </div>
    );
  },
);
interface TabsSectionProps {
  profile: UserProfileType;
  upcomingEvents: DetailedEventType[];
  hostedEvents: DetailedEventType[];
  pastEvents: DetailedEventType[];
  savedPlaces: PlaceType[];
  likedPlaces: PlaceType[];
  requests?: ActiveRequestType[];
}

export const TabsSection = component$<TabsSectionProps>(
  ({
    upcomingEvents,
    profile,
    hostedEvents,
    pastEvents,
    likedPlaces,
    requests = [],
  }) => {
    const loc = useLocation();

    const tab = loc.url.searchParams.get("tab") ?? "upcoming";
    const activeTab = useSignal(tab);
    const isEditing = useSignal(false);

    // Self-contained functions for profile editing
    // Ensure icons match IconComponent type
    const tabs: {
      id: string;
      label: string;
      icon: any;
      count: number;
    }[] = [
      {
        id: "profile",
        label: "Profile",
        icon: User,
        count: 0,
      },
      {
        id: "upcoming",
        label: "Upcoming",
        icon: Calendar,
        count: upcomingEvents.length,
      },
      {
        id: "hosted",
        label: "Hosted",
        icon: UserPlus,
        count: hostedEvents.length,
      },
      {
        id: "requests",
        label: "Requests",
        icon: Bell,
        count: requests.length,
      },

      {
        id: "liked",
        label: "Liked Places",
        icon: Bookmark,
        count: likedPlaces.length,
      },
      {
        id: "past",
        label: "Past Events",
        icon: Clock,
        count: pastEvents.length,
      },
    ];

    return (
      <div class="w-full">
        <div class="mb-8 mt-10 border-b border-[#F8EDE3] shadow-sm">
          <nav
            class="justify-left -mb-px flex space-x-8 overflow-x-auto px-4 pb-1"
            aria-label="Tabs"
          >
            {tabs.map((tab) => {
              // Capture serializable values and component reference outside the JSX scope
              // to avoid potential serialization issues with the entire 'tab' object in onClick$.
              const tabId = tab.id;
              const TabIcon = tab.icon;
              const tabLabel = tab.label;
              const tabCount = tab.count;

              return (
                <Link
                  scroll={false}
                  href={"/profile?tab=" + tabId}
                  key={tabId}
                  onClick$={() => (activeTab.value = tabId)} // Use captured primitive value
                  class={`group inline-flex shrink-0 items-center whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium transition-colors duration-150 ease-in-out focus:outline-none ${
                    activeTab.value === tabId // Use captured primitive value
                      ? "border-[#D98E73] text-[#C27B62]"
                      : "border-transparent text-[#6D5D4E] hover:border-gray-300 hover:text-[#5B3E29]"
                  }`}
                  aria-current={activeTab.value === tabId ? "page" : undefined} // Use captured primitive value
                >
                  <TabIcon // Render the component directly
                    class={`mr-2 h-5 w-5 ${
                      activeTab.value === tabId // Use captured primitive value
                        ? "text-[#D98E73]"
                        : "text-gray-400 group-hover:text-gray-500"
                    }`}
                    aria-hidden="true"
                  />
                  <span>{tabLabel}</span>
                  {tabCount > 0 && (
                    <span
                      class={`ml-2.5 hidden rounded-full px-2.5 py-1 text-xs font-semibold md:inline-block ${
                        activeTab.value === tabId // Use captured primitive value
                          ? "bg-[#FFF1E6] text-[#C27B62]"
                          : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                      }`}
                    >
                      {tabCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div class=" px-4">
          {activeTab.value === "profile" && !isEditing.value && (
            <ProfileView isEditing={isEditing} profileData={profile} />
          )}

          {activeTab.value === "profile" && isEditing.value && (
            <ProfileEdit profileData={profile} isEditing={isEditing} />
          )}

          {activeTab.value === "upcoming" &&
            (upcomingEvents.length > 0 ? (
              <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.eventID ?? event.id} event={event} />
                ))}
              </div>
            ) : (
              <EmptyState
                context="CalendarIcon" // Use conte
                title="No Upcoming Events"
                message="You haven't joined or been invited to any events yet. Explore events to join!"
              />
            ))}

          {activeTab.value === "hosted" &&
            (hostedEvents.length > 0 ? (
              <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {hostedEvents.map((event) => (
                  <EventCard
                    key={event.eventID ?? event.id}
                    event={event}
                    isHosted
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                context="UsersIcon" // Use context instead of icon (UserPlus mapped to UsersIcon context)
                title="No Hosted Events Yet"
                message="Ready to gather some folks? Host your first event and bring people together."
                actionButton={{ label: "Host an Event", href: "/create-event" }}
              />
            ))}

          {activeTab.value === "past" &&
            (pastEvents.length > 0 ? (
              <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {pastEvents.map((event) => (
                  <EventCard key={event.eventID ?? event.id} event={event} />
                ))}
              </div>
            ) : (
              <EmptyState
                context="CalendarIcon"
                title="No Past Events"
                message="You haven't attended any events yet. Join some events to build your history!"
                actionButton={{ label: "Find Events", href: "/events" }}
              />
            ))}
          {activeTab.value === "requests" &&
            (requests.length > 0 ? (
              <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"></div>
            ) : (
              <EmptyState
                context="BellIcon" // Use Bell icon context for requests
                title="No Pending Requests"
                message="You don't have any pending requests at the moment."
              />
            ))}

          {activeTab.value === "liked" &&
            (likedPlaces.length > 0 ? (
              <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {likedPlaces.map((place) => (
                  <PlaceCard key={place.placeId ?? place.id} place={place} />
                ))}
              </div>
            ) : (
              <EmptyState
                context="MapPinIcon"
                title="No Liked Places"
                message="You haven't liked any places yet. Browse places and click the heart icon to add them here."
                actionButton={{ label: "Discover Places", href: "/places" }}
              />
            ))}
        </div>
      </div>
    );
  },
);
