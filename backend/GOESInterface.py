import shutil, subprocess, random, os
from models import db, Cloud, connect_db
from flask import Flask

# collection of static methods for interfacing with movie-GOES
class GOES_Interface():
    
    backend_dest = 'GOES-renders'
    frontend_dest = '../frontend/public/cloud-set'

    @classmethod
    def transfer_output_to_frontend(self):      
        try:
            shutil.rmtree(self.frontend_dest)
            shutil.copytree(self.backend_dest, self.frontend_dest)
            print('yup')
        except Exception as e:
            print(e)
            print('nope')

    @classmethod
    def reseed_database(self):
      # sets up application context so database can be manipulated
      app = Flask(__name__)
      app.config['SQLALCHEMY_DATABASE_URI'] = (
      os.environ.get('DATABASE_URL', 'postgresql:///cloudtv'))
      app.app_context().push()
      connect_db(app)

      # drop and recreate tables
      db.drop_all()
      db.create_all()

      # gets list of GOES movie file names
      dir_list = os.listdir(self.backend_dest)
      movies = [m for m in dir_list if '.mp4' in m]
      
      # creates entry in Cloud db table for each movie to be accessed later by frontend 
      for movie in movies:
          cloud = Cloud(
              file=movie
          )
          db.session.add(cloud)

      db.session.commit()
      print('seeded')    
        

    @classmethod 
    def get_GOES_video(self):
      prompt = self.random_GOES_prompt()
      subprocess.Popen(prompt, shell=True)  
      
    @classmethod
    def random_GOES_prompt(self):
        start_year = random.randint(2010, 2022)

        start_month = random.randint(1, 12)
        if start_month < 10: 
            start_month = f'0{start_month}'

        start_day = random.randint(1, 27)
        if start_day < 10: 
            start_day = f'0{start_day}'

        time = random.randint(0, 24)
        if time < 10:
            time = f'0{time}:00'
        else:
            time = f'{time}:00'


        hours = '24'

        sat = random.randint(0, 1)
        if sat == 0:
            sat = "EAST"
        elif sat == 1: 
            sat = "WEST"

        band = random.randint(1, 16)

        colors = ['viridis', 'plasma', 'inferno', 'magma', 'cividis', 'PiYG', 'PRGn', 'BrBG', 'PuOr', 'RdGy', 'RdBu', 'RdYlBu', 'RdYlGn', 'Spectral', 'coolwarm', 'bwr', 'seismic', 'berlin', 'managua', 'vanimo', 'twilight', 'twilight_shifted', 'hsv', 'prism', 'ocean', 'gist_earth', 'terrain','gist_stern', 'gnuplot', 'gnuplot2', 'CMRmap','cubehelix', 'brg', 'gist_rainbow', 'rainbow', 'jet','turbo', 'nipy_spectral', 'gist_ncar']
        colors = colors[random.randint(0, len(colors) - 1)]

        domain = 'M' 
                        
        res = '4k'
        scale = '2'
        output = self.backend_dest
        cache = 'noaa_data'

        return f'moviegoes --start "{start_year}-{start_month}-{start_day} {time}" --hours {hours} --sat {sat} --band {band} --colors {colors} --domain {domain} --res {res} --output {output} --cache {cache}'

# moviegoes --start "2020-07-09 09:00" --hours 2 --sat WEST --band 10 --colors twilight --res native --scale 2 --output GOES-renders --cache noaa_data 
# moviegoes --start "2021-09-04 08:00" --hours 4 --sat EAST --band 16 --colors gist_stern --res native --scale 2

