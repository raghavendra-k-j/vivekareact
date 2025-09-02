


import { useEffect, useMemo, useState } from "react";

/**
 * Multi‑Tenant Sign‑Up Wizard — OTP inline on the same page as email
 * Framework: React, Styling: TailwindCSS
 *
 * Steps: 1) Account (+ inline OTP) 2) Organization 3) Role & Password 4) Review
 * Replace mock API calls with your real endpoints.
 */

// ------- Utilities -------
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const subdomainRegex = /^[a-z0-9]([a-z0-9-]{1,28}[a-z0-9])?$/; // 2-30 total, no leading/trailing hyphen

function classNames(...xs: any[]) {
    return xs.filter(Boolean).join(" ");
}

function maskEmail(email: string) {
    const [user, domain] = email.split("@");
    if (!user || !domain) return email;
    const masked = user.length <= 1 ? user : user[0] + "*".repeat(Math.max(1, user.length - 1));
    return `${masked}@${domain}`;
}

// Debounce hook
function useDebounced<T>(value: T, delay = 400) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);
    return debounced;
}

// ------- Mock API layer (replace with real calls) -------
const mockApi = {
    async createSignupRequest(_payload: any) {
        await wait(400);
        return { request_id: cryptoRandomId(), warning: false };
    },
    async sendOtp(_requestId: string) {
        await wait(300);
        return { ok: true };
    },
    async verifyOtp({ code }: { requestId: string; code: string }) {
        await wait(400);
        if (code !== "123456") throw new Error("Invalid or expired code");
        return { ok: true };
    },
    async checkSubdomain(name: string) {
        await wait(350);
        const taken = ["app", "api", "www", "admin", "demo", "acme"];
        const available = !taken.includes(name);
        const suggestions = available
            ? []
            : [
                    `${name}-hq`,
                    `${name}-team`,
                    `${name}-2025`,
                    `${name}-io`,
                ].filter((v, i, a) => a.indexOf(v) === i);
        return { available, suggestions };
    },
    async saveOrgBasics(_args: { requestId: string; display_name: string; subdomain: string; org_type: string }) {
        await wait(250);
        return { ok: true };
    },
    async saveCredentials(_args: { requestId: string; role: string; password: string }) {
        await wait(250);
        return { ok: true };
    },
    async commit(_args: { requestId: string }) {
        await wait(600);
        return { subdomain: "acme" };
    },
};

function cryptoRandomId() {
    try {
        const arr = new Uint32Array(4);
        crypto.getRandomValues(arr);
        return Array.from(arr).map((n) => n.toString(16)).join("").slice(0, 24);
    } catch {
        return Math.random().toString(16).slice(2);
    }
}

function wait(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
}

// ------- Component -------
export default function SignUpPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [requestId, setRequestId] = useState("");
    const [info, setInfo] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        mobile: "",
        otp: "",
        orgDisplayName: "",
        subdomain: "",
        orgType: "Company",
        role: "owner",
        password: "",
        confirmPassword: "",
    });

    // derived states
    const debouncedSubdomain = useDebounced(form.subdomain.trim().toLowerCase());
    const [subAvail, setSubAvail] = useState<{ available: boolean | null; suggestions: string[] }>({ available: null, suggestions: [] });
    useEffect(() => {
        let active = true;
        (async () => {
            setError("");
            if (!debouncedSubdomain || !subdomainRegex.test(debouncedSubdomain)) {
                setSubAvail({ available: null, suggestions: [] });
                return;
            }
            const res = await mockApi.checkSubdomain(debouncedSubdomain);
            if (active) setSubAvail(res);
        })();
        return () => { active = false };
    }, [debouncedSubdomain]);

    // ------- Handlers -------
    async function onStep1SendCode(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(""); setInfo("");
        const { name, email, mobile } = form;
        if (!name || name.length < 2) return setError("Please enter your full name.");
        if (!emailRegex.test(email)) return setError("Enter a valid work email.");
        setLoading(true);
        try {
            const { request_id } = await mockApi.createSignupRequest({ name, email, mobile });
            setRequestId(request_id);
            await mockApi.sendOtp(request_id);
            setOtpSent(true);
            setInfo(`We sent a 6‑digit code to ${maskEmail(email)}. Use 123456 in this demo.`);
        } catch (err) {
            if (err instanceof Error) setError(err.message || "Could not send code.");
            else setError("Could not send code.");
        } finally { setLoading(false); }
    }

    async function onVerifyOtp(e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setError("");
        if (!form.otp || form.otp.length !== 6) return setError("Enter the 6‑digit code.");
        setVerifyingOtp(true);
        try {
            await mockApi.verifyOtp({ requestId, code: form.otp });
            setStep(2);
            setInfo("");
        } catch (err) {
            if (err instanceof Error) setError(err.message || "Invalid code.");
            else setError("Invalid code.");
        } finally { setVerifyingOtp(false); }
    }

    function onChangeEmail() {
        setOtpSent(false);
        setForm({ ...form, otp: "" });
        setInfo("");
        setRequestId("");
    }

    async function onStep2Submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        const name = form.orgDisplayName.trim();
        const sub = form.subdomain.trim().toLowerCase();
        if (name.length < 2) return setError("Organization name looks too short.");
        if (!subdomainRegex.test(sub)) return setError("Subdomain must be 2–30 chars, letters/numbers/hyphens, no leading/trailing hyphen.");
        if (subAvail.available === false) return setError("That subdomain is taken. Pick another.");
        setLoading(true);
        try {
            await mockApi.saveOrgBasics({ requestId, display_name: name, subdomain: sub, org_type: form.orgType });
            setStep(3);
        } catch (err) {
            if (err instanceof Error) setError(err.message || "Could not save organization details.");
            else setError("Could not save organization details.");
        } finally { setLoading(false); }
    }

    async function onStep3Submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        const { password, confirmPassword, role } = form;
        if (!password || password.length < 8) return setError("Password must be at least 8 characters.");
        if (password !== confirmPassword) return setError("Passwords do not match.");
        setLoading(true);
        try {
            await mockApi.saveCredentials({ requestId, role, password });
            setStep(4);
        } catch (err) {
            if (err instanceof Error) setError(err.message || "Could not save credentials.");
            else setError("Could not save credentials.");
        } finally { setLoading(false); }
    }

    async function onCommit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await mockApi.commit({ requestId });
            setInfo(`Organization created! Redirecting to https://${form.subdomain || res.subdomain}.yourapp.com/welcome …`);
        } catch (err) {
            if (err instanceof Error) setError(err.message || "Creation failed. Please try again.");
            else setError("Creation failed. Please try again.");
        } finally { setLoading(false); }
    }

    // ------- Stepper UI -------
    const steps = ["Account", "Organization", "Role & Password", "Review"]; 

    function Stepper() {
        return (
            <ol className="mb-6 flex items-center justify-center gap-2 text-sm">
                {steps.map((label, i) => {
                    const idx = i + 1;
                    const active = idx === step;
                    const done = idx < step;
                    return (
                        <li key={label} className="flex items-center gap-2">
                            <div className={classNames(
                                "size-6 rounded-full flex items-center justify-center border",
                                done ? "bg-green-600 text-white border-green-600" : active ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-500 border-gray-300"
                            )}>
                                {done ? "✓" : idx}
                            </div>
                            <span className={classNames("hidden sm:block", active ? "font-semibold text-gray-900" : "text-gray-500")}>{label}</span>
                            {idx < steps.length && <span className="mx-2 text-gray-300">—</span>}
                        </li>
                    );
                })}
            </ol>
        );
    }

    // ------- Field components -------
    const Input = ({ label, type = "text", value, onChange, placeholder, autoFocus = false, ...rest }: {
        label: string;
        type?: string;
        value: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        placeholder?: string;
        autoFocus?: boolean;
        [key: string]: any;
    }) => (
        <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoFocus={autoFocus}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none ring-blue-600 focus:border-blue-500 focus:ring-2 disabled:bg-gray-50"
                {...rest}
            />
        </label>
    );

    const RadioGroup = ({ label, name, options, value, onChange }: {
        label: string;
        name: string;
        options: { label: string; value: string }[];
        value: string;
        onChange: (v: string) => void;
    }) => (
        <fieldset>
            <legend className="mb-1 block text-sm font-medium text-gray-700">{label}</legend>
            <div className="flex gap-6">
                {options.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 text-gray-700">
                        <input type="radio" name={name} value={opt.value} checked={value === opt.value} onChange={(e) => onChange(e.target.value)} />
                        {opt.label}
                    </label>
                ))}
            </div>
        </fieldset>
    );

    // Strength meter (very naive)
    const strength = useMemo(() => {
        const p = form.password || "";
        let score = 0;
        if (p.length >= 8) score++;
        if (/[A-Z]/.test(p)) score++;
        if (/[a-z]/.test(p)) score++;
        if (/[0-9]/.test(p)) score++;
        if (/[^A-Za-z0-9]/.test(p)) score++;
        return score; // 0-5
    }, [form.password]);

    // ------- Render per step -------
    return (
        <div className="min-h-svh bg-gray-50 py-10">
            <div className="mx-auto w-full max-w-xl">
                <Stepper />
                <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-black/5">
                    {info && (
                        <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">{info}</div>
                    )}
                    {error && (
                        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">{error}</div>
                    )}

                    {step === 1 && (
                        <form onSubmit={onStep1SendCode} className="space-y-4">
                            <h1 className="text-xl font-semibold">Create your account</h1>
                            <Input label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" autoFocus disabled={otpSent} />
                            <Input label="Work email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value.trim() })} placeholder="jane@acme.com" disabled={otpSent} />
                            <Input label="Mobile (optional)" type="tel" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder="+1 555 123 4567" disabled={otpSent} />

                            {!otpSent && (
                                <div className="flex items-center justify-between pt-2">
                                    <a className="text-sm text-gray-600 hover:text-gray-800" href="#">Already have an account? Sign in</a>
                                    <button disabled={loading} className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60">
                                        {loading ? "Please wait…" : "Send verification code"}
                                    </button>
                                </div>
                            )}

                            {otpSent && (
                                <div className="mt-4 space-y-3 rounded-2xl border border-gray-200 p-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-base font-semibold">Verify your email</h2>
                                        <button type="button" onClick={onChangeEmail} className="text-sm text-gray-600 hover:text-gray-800">Change email</button>
                                    </div>
                                    <p className="text-sm text-gray-600">Enter the 6‑digit code we sent to <strong>{maskEmail(form.email)}</strong>. (Demo code: <code>123456</code>)</p>
                                    <Input label="Code" inputMode="numeric" pattern="[0-9]*" maxLength={6} value={form.otp} onChange={(e) => setForm({ ...form, otp: e.target.value.replace(/\D/g, "").slice(0, 6) })} placeholder="123456" autoFocus />
                                    <div className="flex items-center justify-between">
                                        <button type="button" className="text-sm text-blue-700 hover:underline" onClick={() => mockApi.sendOtp(requestId).then(() => setInfo(`We re‑sent the code to ${maskEmail(form.email)}.`))}>Resend code</button>
                                        <div className="flex gap-3">
                                            <button type="button" onClick={onVerifyOtp} disabled={verifyingOtp} className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60">{verifyingOtp ? "Verifying…" : "Verify & continue"}</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <p className="text-xs text-gray-500">By continuing, you agree to our Terms and Privacy Policy.</p>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={onStep2Submit} className="space-y-4">
                            <h1 className="text-xl font-semibold">Your organization</h1>
                            <Input label="Organization name" value={form.orgDisplayName} onChange={(e) => setForm({ ...form, orgDisplayName: e.target.value })} placeholder="Acme Inc." autoFocus />

                            <div>
                                <label className="block">
                                    <span className="mb-1 block text-sm font-medium text-gray-700">Subdomain</span>
                                    <div className="flex items-stretch gap-2">
                                        <input
                                            value={form.subdomain}
                                            onChange={(e) => setForm({ ...form, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                                            placeholder="acme"
                                            className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none ring-blue-600 focus:border-blue-500 focus:ring-2"
                                        />
                                        <span className="inline-flex items-center rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-600">.yourapp.com</span>
                                    </div>
                                </label>
                                {form.subdomain && (
                                    <p className={classNames("mt-1 text-sm", subAvail.available ? "text-green-700" : subAvail.available === false ? "text-red-700" : "text-gray-500") }>
                                        {subdomainRegex.test(form.subdomain) ? (
                                            subAvail.available === null ? "Checking availability…" : subAvail.available ? "Subdomain is available" : "That subdomain is taken"
                                        ) : "2–30 chars: letters, numbers, hyphens"}
                                    </p>
                                )}
                                {subAvail.suggestions?.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2 text-sm">
                                        {subAvail.suggestions.map((s) => (
                                            <button type="button" key={s} onClick={() => setForm({ ...form, subdomain: s })} className="rounded-full border border-gray-300 px-3 py-1 hover:bg-gray-50">{s}</button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block">
                                    <span className="mb-1 block text-sm font-medium text-gray-700">Organization type (optional)</span>
                                    <select value={form.orgType} onChange={(e) => setForm({ ...form, orgType: e.target.value })} className="w-full rounded-xl border border-gray-300 px-3 py-2">
                                        <option>Company</option>
                                        <option>Non-profit</option>
                                        <option>School</option>
                                        <option>Government</option>
                                        <option>Other</option>
                                    </select>
                                </label>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <button type="button" onClick={() => setStep(1)} className="text-sm text-gray-600 hover:text-gray-800">Back</button>
                                <button disabled={loading} className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60">{loading ? "Saving…" : "Continue"}</button>
                            </div>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={onStep3Submit} className="space-y-4">
                            <h1 className="text-xl font-semibold">Your role & password</h1>
                            <RadioGroup
                                label="Who is creating this organization?"
                                name="creator-role"
                                value={form.role}
                                onChange={(v) => setForm({ ...form, role: v })}
                                options={[
                                    { label: "Owner", value: "owner" },
                                    { label: "Administrator", value: "admin" },
                                ]}
                            />

                            <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" autoFocus />
                            <div className="h-2 w-full rounded-full bg-gray-200">
                                <div className={classNames("h-2 rounded-full", strength <= 2 ? "bg-red-500" : strength === 3 ? "bg-yellow-500" : "bg-green-600")} style={{ width: `${(strength / 5) * 100}%` }} />
                            </div>
                            <p className="text-xs text-gray-500">Use at least 8 characters. Adding numbers, symbols, and mixed case strengthens your password.</p>

                            <Input label="Confirm password" type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="••••••••" />

                            <div className="flex items-center justify-between pt-2">
                                <button type="button" onClick={() => setStep(2)} className="text-sm text-gray-600 hover:text-gray-800">Back</button>
                                <button disabled={loading} className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60">{loading ? "Saving…" : "Continue"}</button>
                            </div>
                        </form>
                    )}

                    {step === 4 && (
                        <form onSubmit={onCommit} className="space-y-4">
                            <h1 className="text-xl font-semibold">Review & create</h1>

                            <div className="space-y-3">
                                <Card title="Account">
                                    <div className="text-sm text-gray-700">
                                        <div><strong>{form.name || "—"}</strong></div>
                                        <div>{form.email} {form.email && <span className="text-green-700">✓ verified</span>}</div>
                                        <div>{form.mobile || "—"}</div>
                                    </div>
                                    <button type="button" onClick={() => setStep(1)} className="text-sm text-blue-700 hover:underline">Change</button>
                                </Card>

                                <Card title="Organization">
                                    <div className="text-sm text-gray-700">
                                        <div>Display name: <strong>{form.orgDisplayName || "—"}</strong></div>
                                        <div>Subdomain: <strong>{form.subdomain || "—"}</strong>.yourapp.com</div>
                                        <div>Type: {form.orgType || "—"}</div>
                                    </div>
                                    <button type="button" onClick={() => setStep(2)} className="text-sm text-blue-700 hover:underline">Change</button>
                                </Card>

                                <Card title="Role">
                                    <div className="text-sm text-gray-700">{form.role === "owner" ? "Owner" : "Administrator"}</div>
                                    <button type="button" onClick={() => setStep(3)} className="text-sm text-blue-700 hover:underline">Change</button>
                                </Card>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <button type="button" onClick={() => setStep(3)} className="text-sm text-gray-600 hover:text-gray-800">Back</button>
                                <button disabled={loading} className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60">{loading ? "Creating…" : "Create organization"}</button>
                            </div>
                        </form>
                    )}
                </div>

                <p className="mt-4 text-center text-xs text-gray-500">Demo only: replace mock API calls with real endpoints. OTP demo code is 123456.</p>
            </div>
        </div>
    );
}

function Card({ title, children }: { title: any; children: React.ReactNode[] }) {
    return (
        <div className="flex items-start justify-between rounded-2xl border border-gray-200 p-4">
            <div>
                <h3 className="mb-1 text-sm font-semibold text-gray-900">{title}</h3>
                <div>{children[0]}</div>
            </div>
            <div className="ml-6 shrink-0">{children[1]}</div>
        </div>
    );
}


