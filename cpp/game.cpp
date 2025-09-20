#include <iostream>

int main() {
    bool isRunning = true;
    int frameCount = 0;

    std::cout << "Starting simple game loop..." << std::endl;

    while (isRunning) {
        // Update game state
        frameCount++;

        // Render game
        std::cout << "Frame: " << frameCount << std::endl;

        // Simple condition to end the loop
        if (frameCount >= 10) {
            isRunning = false;
        }
    }

    std::cout << "Game loop finished." << std::endl;

    return 0;
}
