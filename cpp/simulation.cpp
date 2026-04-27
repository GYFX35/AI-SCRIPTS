#include <iostream>
#include <vector>
#include <cmath>

struct Vector2D {
    float x, y;
};

class Particle {
public:
    Vector2D position;
    Vector2D velocity;
    float mass;

    Particle(float x, float y, float m) : mass(m) {
        position = {x, y};
        velocity = {0, 0};
    }

    void applyForce(Vector2D force) {
        velocity.x += force.x / mass;
        velocity.y += force.y / mass;
    }

    void update() {
        position.x += velocity.x;
        position.y += velocity.y;
    }
};

int main() {
    std::cout << "--- C++ Game Development: Physics Simulation ---" << std::endl;

    Particle ball(0, 100, 1.0f);
    Vector2D gravity = {0, -9.81f};

    std::cout << "Simulating a falling ball with gravity..." << std::endl;

    for (int i = 0; i < 10; ++i) {
        ball.applyForce(gravity);
        ball.update();
        std::cout << "Time: " << i << "s | Position Y: " << ball.position.y << " | Velocity Y: " << ball.velocity.y << std::endl;
    }

    std::cout << "Simulation complete." << std::endl;

    return 0;
}
