import json


def main():
    f = open('words.txt', 'r')
    lst = []
    for line in f:
        lst.append(line.strip().upper())

    dicString = json.dumps(lst)
    f.close()

    fw = open('dictionary.json', 'w')
    fw.write(dicString)
    fw.close()

if __name__ == '__main__':
    main()
