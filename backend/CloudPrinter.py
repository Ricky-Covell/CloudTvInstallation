from GOESInterface import GOES_Interface
import argparse

# print(GOES_Interface.random_GOES_prompt())
# GOES_Interface.get_GOES_video()
# GOES_Interface.reseed_database()
# GOES_Interface.transfer_output_to_frontend()

if __name__ == '__main__':
    # if you type --help
    parser = argparse.ArgumentParser(description='Run some functions')

    # Add a command
    parser.add_argument('--get', help='retrieves .mp4 from movieGOES')
    parser.add_argument('--seed', help='seeeds cloudTV db with urls AND transfers .mp4 files to frontend')

    # Get our arguments from the user
    args = parser.parse_args()

    if args.get:
        GOES_Interface.get_GOES_video()

    if args.seed:
        GOES_Interface.transfer_output_to_frontend()
        GOES_Interface.reseed_database()