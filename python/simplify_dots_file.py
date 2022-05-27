import json
import numpy as np
import pandas as pd

print('running')

pop_dots = pd.read_csv('../data-raw/tot_pop_dots.csv')

pop_dots = pop_dots.replace("rural_in_metro", 1) # Metro fringe
pop_dots = pop_dots.replace("rural_in_nonmetro", 2) # Open lands
pop_dots = pop_dots.replace("urban_in_nonmetro", 3) # Small towns

pop_dots.to_csv('../data/tot_pop_dots_simplified.csv')