"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import type {
  ApplicationPrompt,
  ServiceWorkflow,
} from "../fixtures/service-workflows";

import styles from "./service-workflow-pages.module.css";

const APPLICANT_FIELDS = [
  {
    id: "fullName",
    label: "Full name",
    placeholder: "Enter your full legal name",
  },
  {
    id: "admissionNumber",
    label: "Admission or student number",
    placeholder: "Example: STC/DEE/2023/041",
  },
  {
    id: "email",
    label: "Email address",
    placeholder: "name@example.com",
  },
  {
    id: "phone",
    label: "Telephone number",
    placeholder: "+254 7XX XXX XXX",
  },
] satisfies ApplicationPrompt[];

function FactCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <article className={styles.factCard}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

export function ServiceInformationWorkspace({
  workflow,
}: {
  workflow: ServiceWorkflow;
}) {
  return (
    <main
      className={styles.page}
      data-d29r23c-service-information={workflow.slug}
    >
      <section className={styles.hero}>
        <div className={`${styles.container} ${styles.heroGrid}`}>
          <div>
            <Link className={styles.backLink} href="/demo#services">
              Back to student services
            </Link>
            <span className={styles.eyebrow}>
              {workflow.category}
            </span>
            <h1>{workflow.title}</h1>
            <p className={styles.heroLead}>
              {workflow.description}
            </p>
            <div className={styles.heroActions}>
              <Link
                className={styles.primaryButton}
                href={workflow.applyHref}
              >
                Start this service
              </Link>
              <Link
                className={styles.quietButton}
                href={workflow.trackHref}
              >
                View demo request
              </Link>
            </div>
          </div>

          <div className={styles.factGrid}>
            <FactCard
              label="Processing time"
              value={workflow.processingTime}
            />
            <FactCard label="Fee" value={workflow.fee} />
            <FactCard
              label="Coordinating department"
              value={workflow.ownerDepartment}
            />
          </div>
        </div>
      </section>

      <section className={styles.content}>
        <div className={`${styles.container} ${styles.contentGrid}`}>
          <div>
            <article className={styles.panel}>
              <header className={styles.panelHeader}>
                <h2>What you need</h2>
                <p>
                  Prepare the following information before starting the
                  request.
                </p>
              </header>
              <div className={styles.sectionBody}>
                <ul className={styles.requirements}>
                  {workflow.requirements.map((requirement) => (
                    <li key={requirement}>{requirement}</li>
                  ))}
                </ul>
              </div>
            </article>

            <article
              className={styles.panel}
              style={{ marginTop: 24 }}
            >
              <header className={styles.panelHeader}>
                <h2>How this request moves</h2>
                <p>
                  Every stage has a responsible department and a visible
                  status in the applicant tracker.
                </p>
              </header>
              <div className={styles.sectionBody}>
                <ol className={styles.stageList}>
                  {workflow.stages.map((stage, index) => (
                    <li key={stage.label}>
                      <b className={styles.stageNumber}>
                        {String(index + 1).padStart(2, "0")}
                      </b>
                      <div className={styles.stageCopy}>
                        <strong>{stage.label}</strong>
                        <span>{stage.department}</span>
                        <small>{stage.description}</small>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </article>

            <article
              className={styles.panel}
              style={{ marginTop: 24 }}
            >
              <header className={styles.panelHeader}>
                <h2>Possible final outputs</h2>
                <p>
                  The final result depends on the outcome of the checks
                  and approvals.
                </p>
              </header>
              <div className={styles.sectionBody}>
                <ul className={styles.outputs}>
                  {workflow.finalOutputs.map((output) => (
                    <li key={output}>{output}</li>
                  ))}
                </ul>
              </div>
            </article>
          </div>

          <aside className={styles.stickyCard}>
            <article className={styles.panel}>
              <div className={styles.ctaCard}>
                <h2>Ready to apply?</h2>
                <p>
                  Complete the guided form, upload the demo documents and
                  see how the case moves through the college.
                </p>

                <dl className={styles.metaList}>
                  <div>
                    <dt>Demo case</dt>
                    <dd>{workflow.caseId}</dd>
                  </div>
                  <div>
                    <dt>Assigned officer</dt>
                    <dd>{workflow.assignedOfficer}</dd>
                  </div>
                  <div>
                    <dt>Payment status</dt>
                    <dd>{workflow.paymentStatus}</dd>
                  </div>
                </dl>

                <Link
                  className={styles.primaryButton}
                  href={workflow.applyHref}
                >
                  Start application
                </Link>
              </div>
            </article>
          </aside>
        </div>
      </section>
    </main>
  );
}

function renderPrompt(
  prompt: ApplicationPrompt,
  value: string,
  update: (value: string) => void,
) {
  if (prompt.type === "select") {
    return (
      <select
        id={prompt.id}
        onChange={(event) => update(event.target.value)}
        value={value}
      >
        <option value="">{prompt.placeholder}</option>
        {prompt.options?.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    );
  }

  if (prompt.type === "textarea") {
    return (
      <textarea
        id={prompt.id}
        onChange={(event) => update(event.target.value)}
        placeholder={prompt.placeholder}
        value={value}
      />
    );
  }

  return (
    <input
      id={prompt.id}
      onChange={(event) => update(event.target.value)}
      placeholder={prompt.placeholder}
      type={prompt.type === "date" ? "date" : "text"}
      value={value}
    />
  );
}

export function ServiceApplicationWorkspace({
  workflow,
}: {
  workflow: ServiceWorkflow;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [uploaded, setUploaded] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [message, setMessage] = useState("");

  const steps = [
    "Applicant details",
    "Service details",
    "Documents and payment",
    "Review and submit",
  ];

  const requiredApplicantFields = APPLICANT_FIELDS.map(
    (field) => field.id,
  );
  const requiredServiceFields = workflow.applicationPrompts
    .filter((prompt) => prompt.id !== "secondChoice")
    .map((prompt) => prompt.id);

  const updateValue = (id: string, value: string) => {
    setValues((current) => ({ ...current, [id]: value }));
    setMessage("");
  };

  const validateStep = () => {
    if (
      step === 0 &&
      requiredApplicantFields.some(
        (fieldId) => !values[fieldId]?.trim(),
      )
    ) {
      setMessage("Complete all applicant-detail fields.");
      return false;
    }

    if (
      step === 1 &&
      requiredServiceFields.some(
        (fieldId) => !values[fieldId]?.trim(),
      )
    ) {
      setMessage("Complete all required service-detail fields.");
      return false;
    }

    if (
      step === 2 &&
      uploaded.length < workflow.requirements.length
    ) {
      setMessage(
        "Use the demo upload control for each required document.",
      );
      return false;
    }

    if (step === 3 && !confirmed) {
      setMessage("Confirm the review statement before submitting.");
      return false;
    }

    return true;
  };

  const next = () => {
    if (!validateStep()) {
      return;
    }

    setMessage("");
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const submit = () => {
    if (!validateStep()) {
      return;
    }

    window.sessionStorage.setItem(
      `faidia-demo-case-${workflow.caseId}`,
      JSON.stringify({
        submittedAt: new Date().toISOString(),
        workflow: workflow.slug,
        values,
        uploaded,
      }),
    );

    router.push(workflow.trackHref);
  };

  const reviewRows = useMemo(() => {
    const prompts = [
      ...APPLICANT_FIELDS,
      ...workflow.applicationPrompts,
    ];

    return prompts
      .filter((prompt) => values[prompt.id])
      .map((prompt) => ({
        label: prompt.label,
        value: values[prompt.id],
      }));
  }, [values, workflow.applicationPrompts]);

  return (
    <main
      className={`${styles.page} ${styles.applicationPage}`}
      data-d29r23c-application={workflow.slug}
    >
      <div className={styles.container}>
        <header className={styles.applicationHeader}>
          <div>
            <Link
              className={styles.backLink}
              href={workflow.serviceHref}
              style={{ color: "#53617d", marginBottom: 18 }}
            >
              Back to service information
            </Link>
            <h1>{workflow.title}</h1>
            <p>
              Complete this seeded application to create demo case{" "}
              {workflow.caseId}.
            </p>
          </div>
          <Link
            className={styles.secondaryButton}
            href={workflow.trackHref}
          >
            Open demo tracker
          </Link>
        </header>

        <ol className={styles.stepper}>
          {steps.map((label, index) => {
            const state =
              index < step
                ? "complete"
                : index === step
                  ? "current"
                  : "pending";

            return (
              <li data-state={state} key={label}>
                <span>{index + 1}</span>
                <strong>{label}</strong>
              </li>
            );
          })}
        </ol>

        <section className={styles.formGrid}>
          <article className={`${styles.panel} ${styles.formPanel}`}>
            {step === 0 ? (
              <>
                <h2>Applicant details</h2>
                <p>
                  These values would normally come from the student
                  profile or applicant account.
                </p>
                <div className={styles.fieldGrid}>
                  {APPLICANT_FIELDS.map((prompt) => (
                    <div className={styles.field} key={prompt.id}>
                      <label htmlFor={prompt.id}>{prompt.label}</label>
                      {renderPrompt(
                        prompt,
                        values[prompt.id] ?? "",
                        (value) => updateValue(prompt.id, value),
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : null}

            {step === 1 ? (
              <>
                <h2>Service details</h2>
                <p>
                  Provide the information needed for this specific
                  workflow.
                </p>
                <div className={styles.fieldGrid}>
                  {workflow.applicationPrompts.map((prompt) => (
                    <div
                      className={`${styles.field} ${
                        prompt.type === "textarea"
                          ? styles.fieldFull
                          : ""
                      }`}
                      key={prompt.id}
                    >
                      <label htmlFor={prompt.id}>{prompt.label}</label>
                      {renderPrompt(
                        prompt,
                        values[prompt.id] ?? "",
                        (value) => updateValue(prompt.id, value),
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <h2>Documents and payment</h2>
                <p>
                  These controls simulate uploads. No file leaves the
                  browser and no payment is processed.
                </p>
                <div className={styles.documentGrid}>
                  {workflow.requirements.map((requirement) => {
                    const isUploaded = uploaded.includes(requirement);

                    return (
                      <div
                        className={styles.documentRow}
                        data-uploaded={
                          isUploaded ? "true" : undefined
                        }
                        key={requirement}
                      >
                        <div>
                          <strong>{requirement}</strong>
                          <small>
                            {isUploaded
                              ? "Demo document attached"
                              : "Required for this workflow"}
                          </small>
                        </div>
                        <button
                          onClick={() =>
                            setUploaded((current) =>
                              current.includes(requirement)
                                ? current.filter(
                                    (item) => item !== requirement,
                                  )
                                : [...current, requirement],
                            )
                          }
                          type="button"
                        >
                          {isUploaded ? "Remove" : "Upload demo"}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <dl className={styles.metaList}>
                  <div>
                    <dt>Fee</dt>
                    <dd>{workflow.fee}</dd>
                  </div>
                  <div>
                    <dt>Demo payment status</dt>
                    <dd>{workflow.paymentStatus}</dd>
                  </div>
                </dl>
              </>
            ) : null}

            {step === 3 ? (
              <>
                <h2>Review and submit</h2>
                <p>
                  Review the captured information before creating the
                  seeded demo case.
                </p>

                <dl className={styles.reviewList}>
                  {reviewRows.map((row) => (
                    <div key={row.label}>
                      <dt>{row.label}</dt>
                      <dd>{row.value}</dd>
                    </div>
                  ))}
                  <div>
                    <dt>Documents attached</dt>
                    <dd>{uploaded.length}</dd>
                  </div>
                  <div>
                    <dt>Demo case ID</dt>
                    <dd>{workflow.caseId}</dd>
                  </div>
                </dl>

                <label className={styles.confirmation}>
                  <input
                    checked={confirmed}
                    onChange={(event) =>
                      setConfirmed(event.target.checked)
                    }
                    type="checkbox"
                  />
                  <span>
                    I confirm that the demo information and document
                    metadata are ready to be submitted. This creates only
                    browser-session activity.
                  </span>
                </label>
              </>
            ) : null}

            <footer className={styles.formFooter}>
              <p className={styles.formMessage} role="status">
                {message}
              </p>
              <div className={styles.heroActions}>
                {step > 0 ? (
                  <button
                    className={styles.secondaryButton}
                    onClick={() => {
                      setStep((current) => Math.max(current - 1, 0));
                      setMessage("");
                    }}
                    type="button"
                  >
                    Back
                  </button>
                ) : null}

                {step < steps.length - 1 ? (
                  <button
                    className={styles.primaryButton}
                    onClick={next}
                    type="button"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    className={styles.primaryButton}
                    onClick={submit}
                    type="button"
                  >
                    Submit request
                  </button>
                )}
              </div>
            </footer>
          </article>

          <aside className={`${styles.panel} ${styles.sideSummary}`}>
            <h2>{workflow.shortTitle}</h2>
            <p>{workflow.description}</p>
            <dl className={styles.metaList}>
              <div>
                <dt>Case ID</dt>
                <dd>{workflow.caseId}</dd>
              </div>
              <div>
                <dt>Processing target</dt>
                <dd>{workflow.processingTime}</dd>
              </div>
              <div>
                <dt>Owner</dt>
                <dd>{workflow.ownerDepartment}</dd>
              </div>
              <div>
                <dt>Fee</dt>
                <dd>{workflow.fee}</dd>
              </div>
            </dl>
          </aside>
        </section>
      </div>
    </main>
  );
}

export function ServiceTrackingWorkspace({
  workflow,
}: {
  workflow: ServiceWorkflow;
}) {
  const [stageIndex, setStageIndex] = useState(
    workflow.currentStageIndex,
  );
  const [message, setMessage] = useState("");

  const completed = stageIndex >= workflow.stages.length;
  const progress = completed
    ? 100
    : Math.round(
        ((stageIndex + 1) / workflow.stages.length) * 100,
      );
  const currentStage = completed
    ? "Completed"
    : workflow.stages[stageIndex].label;
  const currentDepartment = completed
    ? workflow.ownerDepartment
    : workflow.stages[stageIndex].department;

  const advance = () => {
    setStageIndex((current) =>
      Math.min(current + 1, workflow.stages.length),
    );
    setMessage("The seeded backend simulation advanced one stage.");
  };

  const reset = () => {
    setStageIndex(workflow.currentStageIndex);
    setMessage("The demo tracker was reset.");
  };

  return (
    <main
      className={`${styles.page} ${styles.trackingPage}`}
      data-d29r23c-tracking={workflow.caseId}
    >
      <div className={styles.container}>
        <header className={styles.trackingHeader}>
          <div>
            <Link
              className={styles.backLink}
              href={workflow.serviceHref}
              style={{ color: "#53617d", marginBottom: 18 }}
            >
              Back to service information
            </Link>
            <h1>Track {workflow.shortTitle}</h1>
            <p>
              Demo case {workflow.caseId} · {workflow.title}
            </p>
          </div>
          <div className={styles.heroActions}>
            <button
              className={styles.secondaryButton}
              onClick={reset}
              type="button"
            >
              Reset demo
            </button>
            <button
              className={styles.primaryButton}
              disabled={completed}
              onClick={advance}
              type="button"
            >
              {completed ? "Request completed" : "Advance demo"}
            </button>
          </div>
        </header>

        <section className={styles.statusStrip}>
          <div>
            <small>Current status</small>
            <strong>{currentStage}</strong>
          </div>
          <div>
            <small>Current department</small>
            <strong>{currentDepartment}</strong>
          </div>
          <div>
            <small>Assigned officer</small>
            <strong>{workflow.assignedOfficer}</strong>
          </div>
          <div>
            <small>Payment/reference</small>
            <strong>{workflow.paymentStatus}</strong>
          </div>
        </section>

        <section className={`${styles.panel} ${styles.progressPanel}`}>
          <div className={styles.progressPanelHeader}>
            <div>
              <h2>Backend-processing progress</h2>
              <p>
                This seeded chart shows how the case moves through
                departments and approval stages.
              </p>
            </div>
            <strong>{progress}% complete</strong>
          </div>

          <div
            aria-label={`${progress}% complete`}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={progress}
            className={styles.progressBar}
            role="progressbar"
          >
            <span style={{ width: `${progress}%` }} />
          </div>

          <div className={styles.trackingStages}>
            {workflow.stages.map((stage, index) => {
              const state =
                completed || index < stageIndex
                  ? "complete"
                  : index === stageIndex
                    ? "current"
                    : "pending";

              return (
                <article
                  className={styles.trackingStage}
                  data-state={state}
                  key={stage.label}
                >
                  <span>Stage {index + 1}</span>
                  <strong>{stage.label}</strong>
                  <small>{stage.department}</small>
                </article>
              );
            })}
          </div>
        </section>

        <section className={styles.trackingGrid}>
          <article className={styles.panel}>
            <header className={styles.panelHeader}>
              <h2>Case timeline</h2>
              <p>
                Status history is visible to the applicant and staff.
              </p>
            </header>
            <div className={styles.sectionBody}>
              {!completed && workflow.actionRequired ? (
                <div className={styles.actionCard}>
                  <strong>Current update</strong>
                  <span>{workflow.actionRequired}</span>
                </div>
              ) : null}

              <ol className={styles.timeline}>
                {workflow.stages.map((stage, index) => {
                  const state =
                    completed || index < stageIndex
                      ? "complete"
                      : index === stageIndex
                        ? "current"
                        : "pending";

                  return (
                    <li data-state={state} key={stage.label}>
                      <b className={styles.timelineDot} />
                      <div>
                        <strong>{stage.label}</strong>
                        <span>{stage.department}</span>
                        <small>{stage.description}</small>
                      </div>
                    </li>
                  );
                })}
              </ol>

              {completed ? (
                <div className={styles.finalOutput}>
                  <h3>Final output available</h3>
                  <ul>
                    {workflow.finalOutputs.map((output) => (
                      <li key={output}>{output}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </article>

          <aside className={styles.panel}>
            <header className={styles.panelHeader}>
              <h2>Case details</h2>
              <p>Seeded applicant-safe information</p>
            </header>
            <div className={styles.sectionBody}>
              <dl className={styles.metaList}>
                <div>
                  <dt>Request ID</dt>
                  <dd>{workflow.caseId}</dd>
                </div>
                <div>
                  <dt>Service</dt>
                  <dd>{workflow.shortTitle}</dd>
                </div>
                <div>
                  <dt>Owner</dt>
                  <dd>{workflow.ownerDepartment}</dd>
                </div>
                <div>
                  <dt>Processing target</dt>
                  <dd>{workflow.processingTime}</dd>
                </div>
                <div>
                  <dt>Required documents</dt>
                  <dd>{workflow.requirements.length}</dd>
                </div>
              </dl>

              <Link
                className={styles.secondaryButton}
                href={workflow.applyHref}
              >
                Start another request
              </Link>
              <p className={styles.formMessage} role="status">
                {message}
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
