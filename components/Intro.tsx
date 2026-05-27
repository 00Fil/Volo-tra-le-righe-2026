"use client";

import { useEffect, useRef, useState } from "react";

type IntroProps = {
	onFinish: () => void;
};

export function Intro({ onFinish }: IntroProps) {
	const stageRef = useRef<HTMLDivElement>(null);
	const brandRef = useRef<HTMLDivElement>(null);
	const denuvoRef = useRef<SVGSVGElement>(null);
	const studioRef = useRef<HTMLSpanElement>(null);
	const [phase, setPhase] = useState<"loading" | "docking" | "done">("loading");

	useEffect(() => {
		let cancelled = false;
		let dockTimeout: number | undefined;
		let finishTimeout: number | undefined;

		const run = async () => {
			try {
				await Promise.race([
					Promise.all([
						document.fonts.load("100px 'Borel'"),
						document.fonts.load("700 100px 'Space Grotesk'"),
					]).then(() => document.fonts.ready),
					new Promise((r) => setTimeout(r, 1400)),
				]);
			} catch (_) {}

			if (cancelled) return;

			denuvoRef.current?.classList.add("appear");
			window.setTimeout(() => {
				if (!cancelled) studioRef.current?.classList.add("in");
			}, 400);

			dockTimeout = window.setTimeout(() => {
				if (cancelled) return;
				dock();
			}, 1240);
		};

		const dock = () => {
			const brand = brandRef.current;
			const stage = stageRef.current;
			if (!brand || !stage) return;

			const r = brand.getBoundingClientRect();
			const cs = getComputedStyle(document.documentElement);
			const scale =
				parseFloat(cs.getPropertyValue("--dock-scale")) || 0.32;
			const pad =
				parseFloat(cs.getPropertyValue("--dock-pad")) || 28;

			const targetCx = pad + (r.width * scale) / 2;
			const targetCy = pad + (r.height * scale) / 2;
			const currentCx = r.left + r.width / 2;
			const currentCy = r.top + r.height / 2;

			const tx = targetCx - currentCx;
			const ty = targetCy - currentCy;

			stage.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
			setPhase("docking");

			finishTimeout = window.setTimeout(() => {
				if (cancelled) return;
				setPhase("done");
				onFinish();
			}, 1500);
		};

		run();

		return () => {
			cancelled = true;
			if (dockTimeout) window.clearTimeout(dockTimeout);
			if (finishTimeout) window.clearTimeout(finishTimeout);
		};
	}, [onFinish]);

	if (phase === "done") return null;

	return (
		<div
			className={`intro-root ${phase === "docking" ? "is-docking" : "is-loading"}`}
			aria-hidden={phase === "docking"}
		>
			<div className="stage" ref={stageRef}>
				<div className="brand" ref={brandRef}>
					<svg
						ref={denuvoRef}
						className="word-svg"
						viewBox="0 0 480 120"
						aria-label="denuvo"
					>
						<text
							className="word-text"
							x="240"
							y="94"
							textAnchor="middle"
							fontFamily="'Borel', cursive"
							fontSize="100"
							textLength="460"
							lengthAdjust="spacingAndGlyphs"
						>
							denuvo
						</text>
					</svg>
					<span ref={studioRef} className="studio-wrap">
						<svg
							className="word-svg"
							viewBox="0 0 480 120"
							aria-label="studio"
						>
							<text
								className="word-text"
								x="240"
								y="94"
								textAnchor="middle"
								fontFamily="'Space Grotesk', system-ui, sans-serif"
								fontWeight={700}
								fontSize="100"
								textLength="460"
								lengthAdjust="spacingAndGlyphs"
							>
								studio
							</text>
						</svg>
					</span>
				</div>
			</div>

			<div
				className="line-loader"
				role="status"
				aria-label="Caricamento in corso"
			>
				<div className="bar" />
			</div>
			<span className="footnote">caricamento</span>
		</div>
	);
}
