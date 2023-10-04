1. I used real time to synchronize my animations. I used timestamp in many sine and cosine functions to generate oscillating movement. I also used timestamp to get proper timing for bubble groups, both the space between groups, and the space between individual bubbles.

2. I have a ground box at the bottom of the screen. It is a basic cube.

3. I have two rocks sitting perfectly on the ground box. They are defined relative to each other.

4. I have 3 seaweeds, each with 10 strands. They are all translated slightly differently so they each sit perfectly on the ground beneath them (or the rock for the middle one)

5. I used sinosoidal motion to animate the seaweed. By using a recursive-like structure to define the strands, they move relative to each other. That means they will always be connected at the 'joints' and will follow the movement of the previous strand. I also used a phase value in my calculations, making the seaweed appear to have a drag effect in the water.

6. I have three strands of seaweed each placed on the ground below them

7. I modelled the fish with a cone boy, two cones for the tail, and two sets of two spheres for the eyes. The tail flaps side to side using sinusoidal motion.

8. The fish swims in a circle around the seaweed. Since the center of the fish is the middle of the body cone, the fish is always facing the right direction

9. I modelled the diver using a sphere for the head, and boxes for the legs, feet, and body. 

10. The diver swims on the right side of the screen. The distance he swims is configurable.

11. The legs of the diver kick. They rotate in relation to the hip joints and knee joints. The two legs kick opposite from each other.

12. The bubbles are defined in the WCS. They float upwards over time. They are spawned where the diver's mouth is. They spawn in random groups of 1 to 4, and groups are separated by random time between 0.5 seconds and 3 seconds

13. The scene matches closely to the demo. One thing that is intentionally different:
    - The seaweed is randomly generated each time the window is refreshed. I did not meticulously model the strands to hve the same rotation relative to each other as is visible in the video. Instead they each get a random rotation offset. Try refreshing a few times, you will see it is different each time! Bonus, change the value of rotationRandomnessScale where the new seaweed is defined!

14. I am against code comments. Code comments often get left untouched when the code is worked on, which results in 'lying comments'. I think comments are only warrented when something unorthodox is needed. In that case, a comment of why that thing needs to be done is acceptable, but it should not explain what that thing is. Instead, good variable and function names should be used. It should be easy to follow code based on function and variable names.
    I took an OOP approach to this assignment as I thought that made the most sense. So I defined a variety of objects which abstract away the drawing of the various pieces of the scene. I found this helped me stay organized and kept the render function clean and concise.

15. The scene is 512x512

16. I submitted a single zip file with the specified name

17. I wrote this readme document.
