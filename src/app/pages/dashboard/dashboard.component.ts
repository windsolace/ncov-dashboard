import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import Chart from 'chart.js';


@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html',
    providers: [DatePipe]
})

export class DashboardComponent implements OnInit {

    public canvas: any;
    public ctx;
    public chartColor;
    public chartEmail;
    public chartHours;

    public historicalRaw: any;
    public datesArr: string[] = [];
    public confirmedArr: number[] = [];
    public latestNewsArr: any = [];
    public current:any = {
        "confirmed":0,
        "deaths":0,
        "recovered":0,
        "date":"-",
        "time":"-"
    }

    constructor(private http: HttpClient, private datePipe: DatePipe) {


    }

    ngOnInit() {

        var confirmedData = [];
        var recoveredData = [];
        var deathsData = [];

        this.http.get("https://coronavirus-tracker-api.herokuapp.com/all").subscribe(allData => {

            confirmedData = allData["confirmed"];
            recoveredData = allData["recovered"];
            deathsData = allData["deaths"];

            let sgConfirmedData = confirmedData["locations"].find(item => item.country === "Singapore");
            let sgRecoveredData = recoveredData["locations"].find(item => item.country === "Singapore");
            let sgDeathsData = deathsData["locations"].find(item => item.country === "Singapore");

            //get current
            this.getCurrent(sgConfirmedData, sgRecoveredData, sgDeathsData);

            //get historical data
            this.getHistory(sgConfirmedData);

        });

        //get news
        this.http.get("/.netlify/functions/news").subscribe(data => {
            console.log(data);
            this.latestNewsArr = data["articles"];
        });
    }

    /**
     * Get count of confirmed, recovered, deaths from current sg data arrays
     * @param confirmed 
     * @param recovered 
     * @param deaths 
     */
    getCurrent(confirmed, recovered, deaths) {

        this.current["confirmed"] = confirmed["latest"];
        this.current["recovered"] = recovered["latest"];
        this.current["deaths"] = deaths["latest"];

        // var datetime = data["dt"];
        // var datetimeArr = datetime.split(" ");
        // var date = datetimeArr[0];
        // var time = datetimeArr[1];
        // this.current["date"] = this.datePipe.transform(date, 'dd MMM yyyy');
        // this.current["time"] = time;

    }

    /**
     * Get historical updates of confirmed cases 
     * @param confirmed 
     */
    getHistory(confirmed) {
        //./assets/json/history-sg.json
        this.historicalRaw = confirmed["history"];
        //break into dates
        var history = confirmed["history"];
        Object.keys(history).forEach((key, index) => {
            //expecting format like "<date> <time>"
            var date = this.datePipe.transform(key.split(" ")[0], 'dd-MMM');
            var todayData:number = history[key] | 0;

            //merge duplicate dates
            if(index == 0) {
                this.datesArr.push(date);
                this.confirmedArr.push(todayData);     
            } else {
                var yesterday = this.datesArr.pop();
                //merge duplicate date and data
                if(date === yesterday) {
                    //add the value to yesterday's confirmedArr
                    var ytdData = this.confirmedArr.pop();
                    this.confirmedArr.push(todayData);
                    this.datesArr.push(date);
                } else {
                    this.datesArr.push(yesterday); //add the popped date back
                    this.datesArr.push(date);
                    this.confirmedArr.push(todayData);  
                }
            }       
        });

        this.generateGraph(this.datesArr, this.confirmedArr);
    }

    generateGraph(xaxis,inputData) {
        this.chartColor = "#FFFFFF";
        
        var speedCanvas = document.getElementById("speedChart");

        var dataFirst = {
            data: inputData,
            fill: false,
            borderColor: '#fbc658',
            backgroundColor: 'transparent',
            // pointBorderColor: '#fbc658',
            // pointRadius: 2,
            // pointHoverRadius: 16,
            // pointBorderWidth: 8,
        };

        var speedData = {
            labels: xaxis,
            datasets: [dataFirst]
        };

        var chartOptions = {
            animation: {
                duration: 0
            },
            hover: {
                animationDuration: 0
            },
            legend: {
                display: false,
                position: 'top'
            }
        };

        var lineChart = new Chart(speedCanvas, {
            type: 'line',
            hover: false,
            data: speedData,
            options: chartOptions
        });
    }
}
