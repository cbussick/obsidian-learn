import { useVirtualizer } from "@tanstack/react-virtual";
import { TFile } from "obsidian";
import { useMemo, useRef, useState } from "react";
import { AddIcon } from "./AddIcon";
import styles from "./NoteSelector.module.css";
import { RemoveIcon } from "./RemoveIcon";

interface NoteSelectorProps {
  allNotes: TFile[];
  selectedNotes: TFile[];
  onSelect: (note: TFile) => void;
  onDeselect: (note: TFile) => void;
  onStart: () => void;
}

const NOTE_SEARCH_INPUT_ID = "note-search";

export const NoteSelector = ({
  allNotes,
  selectedNotes,
  onSelect,
  onDeselect,
  onStart,
}: NoteSelectorProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedPaths = useMemo(
    () => new Set(selectedNotes.map((n) => n.path)),
    [selectedNotes],
  );

  const filteredNotes = useMemo(
    () =>
      allNotes.filter((note) =>
        note.path.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [allNotes, searchQuery],
  );

  const virtualizer = useVirtualizer({
    count: filteredNotes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 32,
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.column}>
        <div className={styles.columnHeader}>
          <label htmlFor={NOTE_SEARCH_INPUT_ID}>All notes</label>
          <input
            id={NOTE_SEARCH_INPUT_ID}
            type="text"
            placeholder="Search for a note..."
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div ref={parentRef} className={styles.list}>
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              position: "relative",
            }}
          >
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const note = filteredNotes[virtualItem.index];
              if (!note) return null;

              const isSelected = selectedPaths.has(note.path);
              return (
                <div
                  key={virtualItem.key}
                  className={`${styles.row} ${isSelected ? styles.rowSelected : ""}`}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                  title={note.path}
                  onClick={() =>
                    isSelected ? onDeselect(note) : onSelect(note)
                  }
                >
                  <span className={styles.rowLabel}>{note.path}</span>

                  <span className={styles.rowActionButton}>
                    {selectedNotes.includes(note) ? (
                      <RemoveIcon />
                    ) : (
                      <AddIcon />
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.column}>
        <div className={styles.columnHeader}>
          <label>Selected notes</label>
        </div>
        <div className={styles.list}>
          {selectedNotes.map((note) => (
            <div
              key={note.path}
              className={`${styles.row} ${styles.rowSelected}`}
              title={note.path}
              onClick={() => onDeselect(note)}
              style={{
                display: "flex",
                gap: "4px",
              }}
            >
              <span className={styles.rowLabel}>{note.path}</span>

              <span className={styles.rowActionButton}>
                {selectedNotes.includes(note) ? (
                  <RemoveIcon />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      width: "1.2em",
                      height: "1.2em",
                      stroke: "var(--color-green)",
                    }}
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12h8" />
                    <path d="M12 8v8" />
                  </svg>
                )}
              </span>
            </div>
          ))}
        </div>
        <button
          className="mod-cta"
          disabled={selectedNotes.length === 0}
          onClick={onStart}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <p>Start</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: "1.3em", height: "1.3em" }}
            >
              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09" />
              <path d="M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z" />
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};
