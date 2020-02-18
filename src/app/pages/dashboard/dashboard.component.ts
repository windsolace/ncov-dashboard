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

    //historical
    public datesArr: string[] = [];
    public confirmedHistoryArr: number[] = [];
    public recoveredHistoryArr: number[] = [];

    public latestNewsArr: any = [];
    public current:any = {
        "confirmed":0,
        "deaths":0,
        "recovered":0,
        "date":"-"
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
            this.getHistory(sgConfirmedData, sgRecoveredData);

        });

        //get news
        this.http.get("/.netlify/functions/news").subscribe(data => {
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
    getHistory(confirmed, recovered) {
        //./assets/json/history-sg.json

        var confirmedHistory = confirmed["history"];
        var recoveredHistory = recovered["history"];
        this.formatHistoricalData(confirmedHistory,recoveredHistory);
        this.generateGraph(this.datesArr, this.confirmedHistoryArr, this.recoveredHistoryArr);

        var latestDate = this.datesArr[this.datesArr.length-1] + new Date().getFullYear();
        this.current['date'] = this.datePipe.transform(latestDate, 'dd MMM yyyy');

    }

    /**
     * Populates arr with formatted data to feed into graph
     * - known issue on 16th Feb that confirmed array's date is not sorted correctly
     * - assumes recovered array has correctly sorted date
     * - assumes confirmed and recovered arrays have same lengths
     * - uses dates from recovered array
     * @param confirmed 
     * @param recovered 
     */
    formatHistoricalData(confirmed, recovered) {
        var tempDateArr = [];
        Object.keys(recovered).forEach((key, index) => {
            tempDateArr.push(new Date(key));
        });

        //sort date objects in ascending order
        tempDateArr.sort((v1,v2)=> {
            return (v1 > v2) ? 1 : -1;
        });

        //populate data based on sorted date array
        tempDateArr.forEach((longDate, i) => {
            var graphDate = this.datePipe.transform(longDate, 'dd-MMM');
            this.datesArr.push(graphDate);
            var dataDate = this.datePipe.transform(longDate, 'M/d/yy'); //API data maintaining M/d/yy as key to each data point
            this.recoveredHistoryArr.push(recovered[dataDate]); 
            this.confirmedHistoryArr.push(confirmed[dataDate]); 
        });
    }

    generateGraph(xaxis,confirmedData, recoveredData) {
        this.chartColor = "#FFFFFF";
        
        var speedCanvas = document.getElementById("speedChart");

        var dataFirst = {
            label:'Confirmed',
            data: confirmedData,
            fill: false,
            borderColor: '#fbc658',
            // backgroundColor: 'rgba(251,198,88,0.5)'
            // pointBorderColor: '#fbc658',
            // pointRadius: 2,
            // pointHoverRadius: 16,
            // pointBorderWidth: 8,
        };

        var dataRecovered = {
            label:'Recovered',
            data: recoveredData,
            fill: false,
            borderColor: '#6bd098',
            // backgroundColor: 'rgba(107,208,152,0.9)'
        }

        var speedData = {
            labels: xaxis,
            datasets: [dataFirst,dataRecovered]
        };

        var chartOptions = {
            animation: {
                duration: 0
            },
            hover: {
                animationDuration: 0
            },
            legend: {
                display: true,
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
