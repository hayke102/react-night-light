import {
    Bodies,
    Body,
    Composite,
    Composites,
    Constraint,
    Engine,
    Mouse,
    MouseConstraint,
    Render,
    Runner,
    World
} from "matter-js";
import * as React from "react";
import { useEffect } from "react";
import styles from "./styles.module.css";

interface Props {
    text: string;
}

export const ExampleComponent = ({ text }: Props) => {
    useEffect(() => {
        const engine = Engine.create({ enableSleeping: true });
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;

        const rect = Bodies.rectangle(170, 0, 100, 100);
        const elastic = Constraint.create({
            pointA: { x: 150, y: 0 },
            bodyB: rect,
            stiffness: 0.005
        });

        const group = Body.nextGroup(true);

        var ropeC = Composites.stack(
            100,
            50,
            13,
            1,
            10,
            10,
            function (x: number, y: number) {
                return Bodies.rectangle(x - 20, y, 50, 20, {
                    collisionFilter: { group: group }
                });
            }
        );
        const c = Bodies.circle(
            ropeC.bodies[ropeC.bodies.length - 1].position.x,
            ropeC.bodies[ropeC.bodies.length - 1].position.y + 10,
            10,
            { collisionFilter: { group: group }, mass: 2 }
        );
        ropeC.bodies.push(c);
        Composites.chain(ropeC, 0.3, 0, -0.3, 0, { stiffness: 1, length: 0 });

        // Composite.add(
        //     ropeC,
        //     Constraint.create({
        //         bodyB: c
        //         // pointB: c.position,
        //         // pointA: ropeC.bodies[ropeC.bodies.length - 1].position
        //     })
        // );
        Composite.add(
            ropeC,
            Constraint.create({
                bodyB: ropeC.bodies[0],
                pointB: { x: -20, y: 0 },
                pointA: {
                    x: ropeC.bodies[0].position.x,
                    y: ropeC.bodies[0].position.y
                },
                stiffness: 0.5
            })
        );
        World.add(engine.world, [ropeC]);
        World.add(engine.world, [c]);
        World.addBody(engine.world, rect);
        World.add(engine.world, elastic);

        const ctx = canvas.getContext("2d");
        const gameInterval = 1000 / 30;

        Engine.run(engine);
        var render = Render.create({
            element: document.body,
            engine: engine
        });
        // const render = Runner.create({
        //     isFixed: true
        // });
        Render.run(render);
        // setInterval(() => {
        //     ctx?.clearRect(0, 0, 500, 500);
        //     // ctx?.fillRect(50, 50, 100, 100);
        //     ctx?.fillRect(rect.position.x - 50, rect.position.y - 50, 100, 100);
        //     Engine.update(engine, gameInterval);
        // }, gameInterval);

        setTimeout(() => {
            // add mouse control
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
        }, 1000);
    }, []);

    return (
        <div className={styles.test}>
            Example Componesntx2ds: {text}
            <canvas width={500} height={500} id="canvas"></canvas>
        </div>
    );
};
