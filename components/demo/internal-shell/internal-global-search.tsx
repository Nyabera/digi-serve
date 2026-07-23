"use client";

import { Search } from "lucide-react";
import {
  useEffect,
  useRef,
  type FormEvent,
} from "react";

import styles from "./internal-shell.module.css";

type InternalGlobalSearchProps = {
  readonly placeholder?: string;
};

export function InternalGlobalSearch({
  placeholder = "Search requests, applicants, services…",
}: InternalGlobalSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyboardShortcut(
      event: KeyboardEvent,
    ) {
      const isShortcut =
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k";

      if (!isShortcut) {
        return;
      }

      event.preventDefault();
      inputRef.current?.focus();
    }

    window.addEventListener(
      "keydown",
      handleKeyboardShortcut,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboardShortcut,
      );
    };
  }, []);

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={styles.search}
    >
      <Search
        aria-hidden="true"
        className={styles.searchIcon}
      />
      <input
        ref={inputRef}
        type="search"
        aria-label="Search internal workspace"
        placeholder={placeholder}
        className="input-base input-compact"
      />
      <kbd
        className={styles.searchShortcut}
        aria-hidden="true"
      >
        ⌘ K
      </kbd>
    </form>
  );
}
