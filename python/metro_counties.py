import json
import numpy as np
import pandas as pd

with open('../data-raw/counties-10m-simplified-10.json', 'r') as f:
    data = json.load(f)

rural_defs = pd.read_csv('../data-raw/rural_definitions_county_flags.csv', dtype = {"geoid": "category"})
metro_county_geoids = rural_defs[rural_defs["rural_cbsa_2019"] == 0.0]["geoid"].tolist()

counties = data["objects"]["counties"]["geometries"]
metro_counties = [x for x in counties if x['id'] in metro_county_geoids]

data["objects"]["counties"]["geometries"] = metro_counties

with open('../data/counties-10m-simplified-10-metro.json', 'w') as outfile:
    json.dump(data, outfile)