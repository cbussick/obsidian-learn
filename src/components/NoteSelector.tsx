import { useVirtualizer } from "@tanstack/react-virtual";
import { fetchOpenAIResponseExercises } from "fetchOpenAIResponse";
import { App, Notice, TFile } from "obsidian";
import { useMemo, useRef, useState } from "react";
import { Exercise } from "schema/Exercise";
import { LearnSettings } from "settings";
import { AddIcon } from "./AddIcon";
import { IconButton } from "./IconButton";
import styles from "./NoteSelector.module.css";
import { RemoveIcon } from "./RemoveIcon";
import { RocketIcon } from "./RocketIcon";
import { Spinner } from "./Spinner";

interface NoteSelectorProps {
  allNotes: TFile[];
  selectedNotes: TFile[];
  onSelect: (note: TFile) => void;
  onDeselect: (note: TFile) => void;
  onStart: (exercises: Exercise[]) => void;
  app: App;
  settings: LearnSettings;
}

const NOTE_SEARCH_INPUT_ID = "note-search";

export const NoteSelector = ({
  allNotes,
  selectedNotes,
  onSelect,
  onDeselect,
  onStart,
  app,
  settings,
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

  const [isLoading, setIsLoading] = useState(false);

  const onStartExercises = () => {
    const apiKey = app.secretStorage.getSecret(settings.openAIKeyName);
    if (!apiKey) {
      new Notice("No OpenAI API key set.");
      return;
    }

    setIsLoading(true);
    fetchOpenAIResponseExercises(apiKey, selectedNotes, app)
      .then((result) => onStart(result))
      .catch((error: Error) => {
        new Notice(error.message);
        console.error(error.message);
      })
      .finally(() => setIsLoading(false));
  };

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
            disabled={isLoading}
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
                    !isLoading &&
                    (isSelected ? onDeselect(note) : onSelect(note))
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
              className={`${styles.row} ${styles.rowSelected} ${styles.selectionList}`}
              title={note.path}
              onClick={() => !isLoading && onDeselect(note)}
            >
              <span className={styles.rowLabel}>{note.path}</span>

              <span className={styles.rowActionButton}>
                {selectedNotes.includes(note) ? <RemoveIcon /> : <AddIcon />}
              </span>
            </div>
          ))}
        </div>
        <button
          className="mod-cta"
          disabled={selectedNotes.length === 0 || isLoading}
          onClick={onStartExercises}
        >
          <IconButton
            label="Start"
            icon={isLoading ? <Spinner /> : <RocketIcon />}
          />
        </button>
      </div>
    </div>
  );
};
