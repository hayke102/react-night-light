import {
    Bodies,
    Body,
    Composite,
    Composites,
    Constraint,
    Engine,
    Events,
    Mouse,
    MouseConstraint,
    Render,
    Runner,
    World
} from "matter-js";
import * as React from "react";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import debounce from "debounce";

interface Props {
    text: string;
}

export const ExampleComponent = ({ text }: Props) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const debouncedDarkModeToggle = debounce(
        () => setIsDarkMode((current) => !current),
        200,
        true
    );

    useEffect(() => {
        const engine = Engine.create({ enableSleeping: true });
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;

        const group = Body.nextGroup(true);

        let isCircle = true;
        const pullRope = Composites.stack(
            150,
            50,
            1,
            10,
            -50,
            -30,
            (x: number, y: number) => {
                isCircle = !isCircle;
                if (!isCircle) {
                    return Bodies.rectangle(x, y, 45, 10, {
                        collisionFilter: { group: group }
                    });
                } else {
                    return Bodies.circle(x, y, 15, {
                        collisionFilter: { group: group }
                    });
                }
            }
        );
        Composites.chain(pullRope, 0.3, 0, -0.3, 0, {
            stiffness: 1,
            length: 0
        });

        Composite.add(
            pullRope,
            Constraint.create({
                bodyB: pullRope.bodies[0],
                pointB: { x: -20, y: 0 },
                pointA: {
                    x: pullRope.bodies[0].position.x,
                    y: pullRope.bodies[0].position.y
                },
                stiffness: 0.1
            })
        );
        World.add(engine.world, [pullRope]);

        Engine.run(engine);
        var render = Render.create({
            element: document.body,
            engine: engine,
            options: {
                wireframes: false
            }
        });

        var mouse = Mouse.create(render.canvas || canvas),
            mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                // @ts-ignore
                constraint: {
                    stiffness: 0.2,
                    render: {
                        visible: false
                    }
                }
            });
        World.add(engine.world, mouseConstraint);
        Events.on(engine, "afterUpdate", function () {
            if (pullRope.bodies[0].position.y > 120) {
                debouncedDarkModeToggle();
                // setIsDarkMode((current) => !current);
                console.log(pullRope.bodies[0].position);
            }
        });

        Render.run(render);
    }, []);

    return (
        <div>
            {isDarkMode ? "DARK MODE" : "LIGHT MODE"}
            {/* <canvas width={500} height={500} id="canvas"></canvas> */}
        </div>
    );
};
