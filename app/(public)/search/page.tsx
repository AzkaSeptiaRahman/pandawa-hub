"use client";

import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, Hash } from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Alert from "@/components/ui/Alert";
import BackButton from "@/components/ui/BackButton";
import SearchSelect from "@/components/ui/SearchSelect";

type GraduateOption = {
  faculty: string;
  study_program: string;
};

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const eventId = searchParams.get("event");

  const [graduationNumber, setGraduationNumber] = useState("");

  const [options, setOptions] = useState<GraduateOption[]>([]);

  const [faculty, setFaculty] = useState("");
  const [study, setStudy] = useState("");

  const [facultyOpen, setFacultyOpen] = useState(false);
  const [studyOpen, setStudyOpen] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    if (!eventId) {
      setError("Invalid event. Please select event again.");
      setLoadingOptions(false);
      return;
    }

    loadOptions();
  }, [eventId]);

  const loadOptions = async () => {
    try {
      setLoadingOptions(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/photos/options?eventId=${eventId}`,
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Cannot load event data");
        return;
      }

      setOptions(data.options || data || []);
    } catch (error) {
      console.error(error);
      setError("Cannot connect to server");
    } finally {
      setLoadingOptions(false);
    }
  };

  const faculties = Array.from(
    new Set(options.map((item) => item.faculty).filter(Boolean)),
  );

  const studies = Array.from(
    new Set(
      options
        .filter((item) => item.faculty === faculty)
        .map((item) => item.study_program)
        .filter(Boolean),
    ),
  );

  const selectFaculty = (value: string) => {
    setFaculty(value);

    // reset prodi kalau fakultas berubah
    setStudy("");

    setFacultyOpen(false);
    setStudyOpen(false);
  };

  const handleSearch = async () => {
    setError("");

    if (!eventId) {
      setError("Invalid event. Please select event again.");
      return;
    }

    if (!graduationNumber || !faculty || !study) {
      setError("Please complete all required fields");
      return;
    }

    if (!/^\d{4}$/.test(graduationNumber)) {
      setError("Graduation number must be 4 digits");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        eventId: Number(eventId),
        graduationNumber,
        faculty,
        studyProgram: study,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/photos/search`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Graduate or photo not found");
        return;
      }

      sessionStorage.setItem("photoSearch", JSON.stringify(payload));

      router.push("/photo");
    } catch (error) {
      console.error(error);
      setError("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="app-hero" aria-hidden="true" />

      <div className="relative z-10 px-5 pt-6 md:px-8">
        <BackButton />
      </div>

      <main className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-5 py-10">
        <div className="w-full max-w-lg rounded-[26px] border border-line-soft bg-card p-7 md:p-9">
          <div className="text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-cente">
              <Image
                src="/Pandawa_Logo_Short_W.png"
                alt="Pandawa"
                width={56}
                height={56}
                className="h-full w-full object-contain"
              />
            </div>

            <h1 className="text-3xl font-extrabold">Find Your Photo</h1>

            <p className="mt-2.5 text-sm text-mid">
              Enter your graduation information
            </p>
          </div>

          <div className="mt-7 space-y-5">
            {/* GRADUATION NUMBER */}
            <div>
              <Label>Graduation Number</Label>

              <div className="relative">
                <Hash
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-low"
                />
                <Input
                  type="text"
                  inputMode="numeric"
                  value={graduationNumber}
                  maxLength={4}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (/^\d*$/.test(value)) {
                      setGraduationNumber(value);
                    }
                  }}
                  placeholder="Example: 0001"
                  className="pl-11"
                />
              </div>
            </div>

            {/* FACULTY */}
            <div>
              <Label>Faculty</Label>

              <SearchSelect
                placeholder="Select Faculty"
                value={faculty}
                options={faculties}
                loading={loadingOptions}
                disabled={loadingOptions || faculties.length === 0}
                disabledPlaceholder={
                  loadingOptions
                    ? "Loading faculties..."
                    : "No faculty available"
                }
                open={facultyOpen}
                onToggle={() => {
                  setFacultyOpen(!facultyOpen);
                  setStudyOpen(false);
                }}
                onChange={selectFaculty}
              />
            </div>

            {/* STUDY PROGRAM */}
            <div>
              <Label>Study Program</Label>

              <SearchSelect
                placeholder="Select Study Program"
                value={study}
                options={studies}
                disabled={!faculty || studies.length === 0}
                disabledPlaceholder={
                  !faculty
                    ? "Select Faculty First"
                    : "No study program available"
                }
                open={studyOpen}
                onToggle={() => {
                  setStudyOpen(!studyOpen);
                  setFacultyOpen(false);
                }}
                onChange={(value) => {
                  setStudy(value);
                  setStudyOpen(false);
                }}
              />
            </div>

            {error && (
              <Alert tone="error">
                <span className="inline-flex items-center gap-2">
                  <AlertTriangle size={15} />
                  {error}
                </span>
              </Alert>
            )}

            <div className="flex justify-center pt-2">
              <Button size="lg" onClick={handleSearch} disabled={loading}>
                {loading ? "SEARCHING..." : "SEARCH PHOTO"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Search() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center text-mid">
          Loading...
        </main>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
