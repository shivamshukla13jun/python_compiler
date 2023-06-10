import matplotlib.pyplot as plt

# x axis values
x = [7,2,3]
# corresponding y axis values
y = [2,8,8]

# plotting the points
plt.plot(x, y)

# naming the x axis
plt.xlabel('x - axis')
# naming the y axis
plt.ylabel('y - axis')

# giving a title to my graph
plt.title('My second graph!')

# function to show the plot
plt.show()